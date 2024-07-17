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
 * /getPartList/{orderID}:
 *   get:
 *     summary: Get the part list file for a specific Hydraulic Unit
 *     tags: [HydraulicUnit]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID of the Hydraulic Unit
 *     responses:
 *       200:
 *         description: Successfully retrieved the part list file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
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

const getPartList = async (req, res) => {
    try {
        const { orderID } = req.params;

        const hydraulicUnit = await HydraulicUnit.findOne({ where: { orderID } });

        if (!hydraulicUnit) {
            return res.status(404).json({ message: 'HydraulicUnit not found' });
        }

        const fileName = `${hydraulicUnit.partListID}.xlsx`;

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `hydraulic/partList/${fileName}`
        };

        const dataStream = await minioClient.getObject(params.Bucket, params.Key);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');

        dataStream.pipe(res);

    } catch (error) {
        console.error('Error retrieving HydraulicUnit part list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getPartList;