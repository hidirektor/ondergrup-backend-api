const Version = require('../../models/Version');
const r2 = require('../../config/cloudflareR2Client');

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

        const update = await Version.findOne({ where: { versionCode } });

        if (!update) {
            return res.status(404).json({ message: 'Version not found' });
        }

        const params = {
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: update.filePath
        };

        r2.getObject(params, (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving file' });
            }

            res.attachment(update.filePath);
            res.send(data.Body);
        });
    } catch (error) {
        console.error('Error downloading new version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = downloadNewVersion;