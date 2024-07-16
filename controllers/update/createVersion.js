const Version = require('../../models/Version');
const r2 = require('../../config/cloudflareR2Client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * @swagger
 * /createVersion:
 *   post:
 *     summary: Create a new version
 *     tags: [Version]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: versionCode
 *         required: true
 *         type: string
 *         description: Version code of the new version
 *         example: "1.0.0"
 *       - in: formData
 *         name: versionTitle
 *         required: true
 *         type: string
 *         description: Title of the new version
 *         example: "Release 1.0.0"
 *       - in: formData
 *         name: versionDesc
 *         required: true
 *         type: string
 *         description: Description of the new version
 *         example: "This release includes several bug fixes and new features."
 *       - in: formData
 *         name: file
 *         required: true
 *         type: file
 *         description: Hex file (.hex) to upload
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
 *                   example: "Version created successfully"
 *                 update:
 *                   $ref: '#/components/schemas/Version'
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