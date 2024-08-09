const HydraulicUnit = require('../../models/HydraulicUnit');
const { v4: uuidv4 } = require('uuid');
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: false // MinIO SSL
});

/**
 * @swagger
 * /downloadSchematic:
 *   post:
 *     summary: Download the schematic file for a specific Hydraulic Unit
 *     tags: [HydraulicUnit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderID
 *             properties:
 *               orderID:
 *                 type: string
 *                 description: The order ID of the Hydraulic Unit
 *     responses:
 *       200:
 *         description: Successfully retrieved the schematic file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Hydraulic Unit not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: HydraulicUnit not found
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

const downloadSchematic = async (req, res) => {
    try {
        const { orderID } = req.body;

        const hydraulicUnit = await HydraulicUnit.findOne({ where: { orderID } });

        if (!hydraulicUnit) {
            return res.status(404).json({ message: 'HydraulicUnit not found' });
        }

        const fileName = `${hydraulicUnit.schematicID}.pdf`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `hydraulic/schematic/${fileName}`
        };

        minioClient.getObject(params.Bucket, params.Key, function (err, dataStream) {
            if (err) {
                console.error('Error retrieving hydraulic unit schematic from MinIO:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.set('Content-Type', 'application/pdf');
            res.set('Content-Disposition', `attachment; filename="${fileName}"`);

            dataStream.pipe(res);
        });

    } catch (error) {
        console.error('Error downloading HydraulicUnit schematic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = downloadSchematic;