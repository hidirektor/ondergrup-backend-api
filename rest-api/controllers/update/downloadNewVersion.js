const Version = require('../../models/Version');
const r2 = require('../../config/cloudflareR2Client');

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