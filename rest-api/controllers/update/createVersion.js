const Version = require('../../models/Version');
const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

const createVersion = async (req, res) => {
    try {
        const { versionCode, versionTitle, versionDesc } = req.body;
        const file = req.file;

        if (!versionCode || !versionTitle || !file) {
            return res.status(400).json({ message: 'versionCode, versionTitle, and file are required' });
        }

        const filePath = `versions/${uuidv4()}.hex`;

        await minioClient.putObject('your-bucket-name', filePath, file.buffer);

        const update = await Version.create({
            versionCode,
            versionTitle,
            versionDesc,
            filePath,
            versionDate: Math.floor(Date.now() / 1000)
        });

        res.status(201).json({ message: 'Version created successfully', update });
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = createVersion;
