const Version = require('../../models/Version');
const r2 = require('../../config/cloudflareR2Client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const createVersion = async (req, res) => {
    try {
        const { versionCode, versionTitle, versionDesc } = req.body;
        const file = req.file;

        if (!versionCode || !versionTitle || !file) {
            return res.status(400).json({ message: 'versionCode, versionTitle, and file are required' });
        }

        const fileExtension = path.extname(file.originalname);
        if (fileExtension !== '.hex') {
            return res.status(400).json({ message: 'Invalid file format. Only .hex files are allowed.' });
        }

        const fileName = `${uuidv4()}.hex`;
        const params = {
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: `versions/${fileName}`,
            Body: file.buffer,
            ContentType: 'application/octet-stream'
        };

        await r2.upload(params).promise();

        const update = await Version.create({
            versionCode,
            versionTitle,
            versionDesc,
            filePath: `versions/${fileName}`,
            versionDate: Math.floor(Date.now() / 1000)
        });

        res.status(201).json({ message: 'Version created successfully', update });
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = createVersion;