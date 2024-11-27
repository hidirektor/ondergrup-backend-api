const HydraulicUnit = require('../../models/HydraulicUnit');
const Minio = require('minio');

/**
 * MinIO Client Configuration
 */
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: false // MinIO SSL
});

/**
 * @swagger
 * /deleteHydraulicUnit:
 *   delete:
 *     summary: Delete a Hydraulic Unit
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
 *                 description: Order ID of the hydraulic unit
 *     responses:
 *       200:
 *         description: Hydraulic Unit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Hydraulic Unit deleted successfully'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: orderID is required
 *       404:
 *         description: Hydraulic Unit not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hydraulic Unit not found
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

const deleteHydraulicUnit = async (req, res) => {
    try {
        const { orderID } = req.body;

        if (!orderID) {
            return res.status(400).json({ message: 'orderID is required' });
        }

        const hydraulicUnit = await HydraulicUnit.findOne({ where: { orderID } });
        if (!hydraulicUnit) {
            return res.status(404).json({ message: 'Hydraulic Unit not found' });
        }

        const { partListID, schematicID } = hydraulicUnit;

        const partListFilePath = `hydraulic/partList/${partListID}.xlsx`;
        const schematicFilePath = `hydraulic/schematic/${schematicID}.pdf`;

        try {
            await minioClient.removeObject(process.env.BUCKET_NAME, partListFilePath);
            await minioClient.removeObject(process.env.BUCKET_NAME, schematicFilePath);
        } catch (error) {
            console.error('Error deleting files from MinIO:', error);
            return res.status(500).json({ message: 'Failed to delete files from storage' });
        }

        await HydraulicUnit.destroy({ where: { orderID } });

        res.status(200).json({ message: 'Hydraulic Unit deleted successfully' });
    } catch (error) {
        console.error('Error deleting Hydraulic Unit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = deleteHydraulicUnit;
