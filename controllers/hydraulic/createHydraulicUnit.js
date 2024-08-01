const HydraulicUnit = require('../../models/HydraulicUnit');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Minio = require('minio');
const User = require("../../models/User");

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: false // MinIO SSL
});

/**
 * @swagger
 * /createHydraulicUnit:
 *   post:
 *     summary: Create a new Hydraulic Unit
 *     tags: [HydraulicUnit]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - orderID
 *               - hydraulicType
 *               - partListFile
 *               - schematicFile
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Username of the user
 *               orderID:
 *                 type: string
 *                 description: Order ID of the hydraulic unit
 *               hydraulicType:
 *                 type: string
 *                 description: Type of the hydraulic unit
 *               partListFile:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing the part list
 *               schematicFile:
 *                 type: string
 *                 format: binary
 *                 description: PDF file containing the schematic
 *     responses:
 *       201:
 *         description: Hydraulic Unit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Hydraulic Unit created successfully.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     update:
 *                       $ref: '#/components/schemas/HydraulicUnit'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: userName, orderID, hydraulicType, partListFile and schematicFile are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const createHydraulicUnit = async (req, res) => {
    try {
        const { userName, orderID, hydraulicType } = req.body;
        const files = req.files;
        const partListFile = files.partListFile ? files.partListFile[0] : null;
        const schematicFile = files.schematicFile ? files.schematicFile[0] : null;

        if (!userName || !orderID || !hydraulicType || !partListFile || !schematicFile) {
            return res.status(400).json({ message: 'userName, orderID, hydraulicType, partListFile and schematicFile are required' });
        }

        const partListFileExtension = path.extname(partListFile.originalname);
        const schematicFileExtension = path.extname(schematicFile.originalname);
        if (partListFileExtension !== '.xlsx' || schematicFileExtension !== '.pdf') {
            return res.status(400).json({ message: 'Invalid file format. Only .xlsx and .pdf files are allowed.' });
        }

        const existingOrderID = await HydraulicUnit.findOne({ where: { orderID } });
        if (existingOrderID) {
            return res.status(400).json({ message: 'Hydraulic Unit with this orderID already exists' });
        }

        const user = await User.findOne({where: { userName }});
        if (!user) {
            return res.status(400).json({ message: 'user not found !' });
        }

        const userID = user.userID;

        const partListID = uuidv4();
        const partListFileName = `${partListID}.xlsx`;

        const partListParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `hydraulic/partList/${partListFileName}`,
            Body: partListFile.buffer,
            ContentType: 'application/octet-stream'
        };

        const schematicID = uuidv4();
        const schematicFileName = `${schematicID}.pdf`;

        const schematicParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `hydraulic/schematic/${schematicFileName}`,
            Body: schematicFile.buffer,
            ContentType: 'application/octet-stream'
        };

        await minioClient.putObject(partListParams.Bucket, partListParams.Key, partListParams.Body, partListParams.ContentType);
        await minioClient.putObject(schematicParams.Bucket, schematicParams.Key, schematicParams.Body, schematicParams.ContentType);

        const update = await HydraulicUnit.create({
            userID,
            userName,
            orderID,
            partListID,
            schematicID,
            hydraulicType
        });

        res.status(201).json({ message: 'Hydraulic Unit created successfully.', payload: { update } });
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = createHydraulicUnit;