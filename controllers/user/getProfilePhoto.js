const ProfilePhoto = require('../../models/ProfilePhoto');
const { v4: uuidv4 } = require('uuid');
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
 * /getProfilePhoto/{userName}:
 *   get:
 *     summary: Retrieves the URL of a user's profile photo by userName.
 *     tags: [User Profile]
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *         description: The username to find the profile photo URL.
 *     responses:
 *       200:
 *         description: Profile photo retrieved successfully.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Profile photo not found.
 *       500:
 *         description: Internal server error.
 */

const getProfilePhoto = async (req, res) => {
    try {
        const { userName } = req.params;

        const profilePhoto = await ProfilePhoto.findOne({ where: { userName } });

        if (!profilePhoto) {
            return res.status(404).json({ message: 'Profile photo not found' });
        }

        const fileName = `${profilePhoto.fileID}.png`;

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `profilePhotos/${fileName}`
        };

        const dataStream = await minioClient.getObject(params.Bucket, params.Key);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');

        dataStream.pipe(res);

    } catch (error) {
        console.error('Error retrieving profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getProfilePhoto;