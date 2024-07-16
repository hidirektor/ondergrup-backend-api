const Version = require('../../models/Version');
const { Op } = require('sequelize');

/**
 * @swagger
 * /checkUpdates:
 *   post:
 *     summary: Check for updates based on current version
 *     tags: [Version]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentVersion:
 *                 type: string
 *                 description: The current version to check against
 *                 example: "1.2.3"
 *     responses:
 *       200:
 *         description: Returns whether an update is available and details if so
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updateAvailable:
 *                   type: boolean
 *                   description: Indicates if an update is available
 *                   example: true
 *                 update:
 *                   type: object
 *                   description: Details of the available update
 *                   properties:
 *                     versionCode:
 *                       type: string
 *                       example: "1.3.0"
 *                     fileSize:
 *                       type: integer
 *                       example: 1024
 *                     crc:
 *                       type: string
 *                       example: "abc123"
 *       400:
 *         description: Bad request - Missing currentVersion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "currentVersion is required"
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

const checkUpdates = async (req, res) => {
    try {
        const { currentVersion } = req.body;

        if (!currentVersion) {
            return res.status(400).json({ message: 'currentVersion is required' });
        }

        const currentReleaseDate = await Version.findOne({
            attributes: ['releaseDate'],
            where: { versionCode: currentVersion }
        });

        const update = await Version.findOne({
            where: {
                releaseDate: {
                    [Op.gt]: currentReleaseDate.releaseDate
                }
            },
            order: [['versionCode', 'DESC']]
        });

        if (update) {
            return res.status(200).json({
                updateAvailable: true,
                update,
                fileSize: update.fileSize,
                crc: update.crc
            });
        } else {
            return res.status(200).json({ updateAvailable: false });
        }
    } catch (error) {
        console.error('Error checking updates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkUpdates;