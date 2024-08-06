const RefreshToken = require('../../models/RefreshToken');
const ActionLog = require("../../models/ActionLog");

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token of the user
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       404:
 *         description: Token not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token not found
 *       500:
 *         description: Error logging out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error logging out
 *                 error:
 *                   type: string
 *                   description: Error details
 */

module.exports = async (req, res) => {
    const { token } = req.body;

    try {
        const refreshToken = await RefreshToken.findOne({ where: { accessToken: token } });
        if (!refreshToken) {
            return res.status(404).json({ message: 'Token not found' });
        }

        await RefreshToken.destroy({ where: { accessToken: token } });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
};