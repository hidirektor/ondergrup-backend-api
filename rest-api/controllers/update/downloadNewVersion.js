const Version = require('../../models/Version');
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

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

        minioClient.getObject('your-bucket-name', update.filePath, (err, stream) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving file' });
            }

            stream.pipe(res);
        });
    } catch (error) {
        console.error('Error downloading new version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = downloadNewVersion;
