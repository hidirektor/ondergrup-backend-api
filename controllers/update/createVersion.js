const Version = require('../../models/Version');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Minio = require('minio');
const ActionLog = require("../../models/ActionLog");
const {createActionLog} = require("../../helpers/logger/actionLog");

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: false // MinIO SSL
});

/**
 * @swagger
 * /createVersion:
 *   post:
 *     summary: Create a new version
 *     tags: [Version]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - versionCode
 *               - versionTitle
 *               - versionDesc
 *               - file
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID of source user
 *               versionCode:
 *                 type: string
 *                 description: Version code of the new version. Must be unique.
 *                 example: "1.0.0"
 *               versionTitle:
 *                 type: string
 *                 description: Title of the new version
 *                 example: "Release 1.0.0"
 *               versionDesc:
 *                 type: string
 *                 description: Description of the new version
 *                 example: "This release includes several bug fixes and new features."
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Hex file (.hex) to upload. Only .hex files are allowed.
 *     responses:
 *       201:
 *         description: Version created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version created successfully."
 *                 payload:
 *                   type: object
 *                   properties:
 *                     update:
 *                       $ref: '#/components/schemas/Version'
 *       400:
 *         description: Bad request - Missing versionCode, versionTitle, or file, or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "versionCode, versionTitle, and file are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

const createVersion = async (req, res) => {
    try {
        const { userID, versionCode, versionTitle, versionDesc } = req.body;
        const file = req.file;

        if (!versionCode || !versionTitle || !file) {
            return res.status(400).json({ message: 'versionCode, versionTitle, and file are required' });
        }

        const fileExtension = path.extname(file.originalname);
        if (fileExtension !== '.hex') {
            return res.status(400).json({ message: 'Invalid file format. Only .hex files are allowed.' });
        }

        // Check if versionCode already exists
        const existingVersion = await Version.findOne({ where: { versionCode } });
        if (existingVersion) {
            return res.status(400).json({ message: 'Version with this versionCode already exists' });
        }

        const versionID = uuidv4();
        const fileName = `${versionID}.hex`;

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `versions/${fileName}`,
            Body: file.buffer,
            ContentType: 'application/octet-stream'
        };

        await minioClient.putObject(params.Bucket, params.Key, params.Body, params.ContentType);

        const update = await Version.create({
            versionTitle,
            versionDesc,
            versionCode,
            versionID
        });

        try {
            await createActionLog({
                sourceUserID: userID,
                affectedUserID: null,
                affectedUserName: null,
                affectedMachineID: null,
                affectedMaintenanceID: null,
                affectedHydraulicUnitID: null,
                operationSection: 'EMBEDDED',
                operationType: 'CREATE',
                operationName: 'Machine Software Created.',
            });
        } catch (error) {
            res.status(500).json({ message: 'Action Log can not created.' });
        }

        res.status(201).json({ message: 'Version created successfully.', payload: { update } });
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = createVersion;