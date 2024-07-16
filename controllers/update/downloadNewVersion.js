const Version = require('../../models/Version');
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
 * /downloadNewVersion:
 *   post:
 *     summary: Download a specific version file
 *     tags: [Version]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               versionCode:
 *                 type: string
 *                 description: Version code of the file to download
 *                 example: "1.0.0"
 *     responses:
 *       200:
 *         description: Version file downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request - Missing versionCode
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "versionCode is required"
 *       404:
 *         description: Version not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version not found"
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

const downloadNewVersion = async (req, res) => {
    try {
        const { versionCode } = req.body;

        if (!versionCode) {
            return res.status(400).json({ message: 'versionCode is required' });
        }

        // Find the version entry with matching versionCode
        const version = await Version.findOne({ where: { versionCode } });

        if (!version) {
            return res.status(404).json({ message: 'Version not found' });
        }

        const versionID = version.versionID;

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `versions/${versionID}.hex`
        };

        // Retrieve the file from MinIO
        minioClient.getObject(params.Bucket, params.Key, (err, dataStream) => {
            if (err) {
                console.error('Error retrieving file:', err);
                return res.status(500).json({ message: 'Error retrieving file' });
            }

            res.attachment(`${versionID}.hex`);
            dataStream.pipe(res);
        });
    } catch (error) {
        console.error('Error downloading new version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = downloadNewVersion;