const ProfilePhoto = require('../../models/ProfilePhoto');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Minio = require('minio');
const sharp = require('sharp');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: false // MinIO SSL
});

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: APIs related to user profiles
 */

/**
 * @swagger
 * /uploadProfilePhoto:
 *   post:
 *     summary: Uploads a user's profile photo and creates a profile photo entry in the database.
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile photo uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 update:
 *                   $ref: '#/components/schemas/ProfilePhoto'
 *       400:
 *         description: Bad request, missing parameters.
 *       500:
 *         description: Internal server error.
 */

const uploadProfilePhoto = async (req, res) => {
    try {
        const { userName } = req.body;
        const file = req.file;

        if (!userName || !file) {
            return res.status(400).json({ message: 'userName and file are required' });
        }

        const fileID = uuidv4();
        const originalFileName = file.originalname;
        const fileExtension = path.extname(originalFileName).toLowerCase();
        let fileName;

        // png'ye dönüştür
        if (fileExtension === '.heic' || fileExtension === '.jpeg' || fileExtension === '.jpg' || fileExtension === '.webp') {
            fileName = `${fileID}.png`;

            const buffer = await sharp(file.buffer)
                .toFormat('png')
                .toBuffer();

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `profilePhotos/${fileName}`,
                Body: buffer,
                ContentType: 'image/png'
            };

            await minioClient.putObject(params.Bucket, params.Key, params.Body, params.ContentType);
        } else if(fileExtension === '.png') {
            fileName = `${fileID}${fileExtension}`;

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `profilePhotos/${fileName}`,
                Body: file.buffer,
                ContentType: 'application/octet-stream'
            };

            await minioClient.putObject(params.Bucket, params.Key, params.Body, params.ContentType);
        } else {
            return res.status(400).json({ message: 'Invalid file format. Only .heic, .jpeg, .jpg and .png files are allowed.' });
        }

        const update = await ProfilePhoto.create({
            userName,
            fileID
        });

        res.status(201).json({ message: 'Profile photo uploaded successfully', update });
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = uploadProfilePhoto;