const ProfilePhoto = require('../../models/ProfilePhoto');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
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
 * /downloadProfilePhoto:
 *   post:
 *     summary: Retrieve user's profile photo
 *     tags: [User Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: User's name of the user and profile photo to retrieve
 *                 example: "hidirektor"
 *     responses:
 *       200:
 *         description: Successfully retrieved the profile photo.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       404:
 *         description: Profile photo not found for the provided user's name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile photo not found for the provided user's name."
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

const downloadProfilePhoto = async (req, res) => {
    try {
        const { userName } = req.body;

        const profilePhoto = await ProfilePhoto.findOne({ where: { userName } });

        if (!profilePhoto) {
            return res.status(404).json({ message: 'Profile photo not found' });
        }

        const fileName = `${profilePhoto.fileID}.png`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `profilePhotos/${fileName}`
        };

        minioClient.getObject(params.Bucket, params.Key, function (err, dataStream) {
            if (err) {
                console.error('Error retrieving profile photo from MinIO:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.set('Content-Type', 'image/png');
            res.set('Content-Disposition', `attachment; filename="${fileName}"`);

            dataStream.pipe(res);
        });

    } catch (error) {
        console.error('Error downloading profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = downloadProfilePhoto;