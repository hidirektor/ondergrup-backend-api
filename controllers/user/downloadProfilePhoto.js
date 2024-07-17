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
 * /downloadProfilePhoto/{userName}:
 *   get:
 *     summary: Downloads a user's profile photo by userName.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *         description: The username to find the profile photo.
 *     responses:
 *       200:
 *         description: Profile photo found and downloaded successfully.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Profile photo not found.
 *       500:
 *         description: Internal server error.
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