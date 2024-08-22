const Users = require('../../models/User');
const bcrypt = require('bcryptjs');
const OTPLog = require("../../models/OTPLog");
const redisClient = require('../../helpers/redisClient');
const { invalidateToken } = require('../../helpers/tokenUtils');
const { invalidateAllTokens } = require('../../helpers/tokenUtils');

/**
 * @swagger
 * /resetPass:
 *   post:
 *     summary: Reset user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - newPassword
 *               - otpSentTime
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *               otpSentTime:
 *                 type: string
 *                 description: The otp sent time unix value
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 message2:
 *                   type: string
 *                   example: OTP not found
 *       500:
 *         description: An unexpected error occurred while resetting the password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred while resetting the password
 */

module.exports = async (req, res) => {
    const { userName, newPassword, otpSentTime } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userID = user.userID;
        const otpLog = await OTPLog.findOne({ where: {userID, otpSentTime} });
        if(!otpLog) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        // Kullanıcının mevcut tüm tokenlarını geçersiz kıl
        redisClient.keys('*', async (err, keys) => {
            if (err) {
                console.error('Redis error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            for (const token of keys) {
                redisClient.get(token, async (err, data) => {
                    if (err || !data) {
                        console.error('Error fetching token data:', err);
                        return;
                    }

                    const tokenData = JSON.parse(data);
                    if (tokenData.userID === user.userID) {
                        await invalidateToken(token);
                    }
                });
            }

            // Yeni şifreyi hashleyip kaydet
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            await invalidateAllTokens(user.userID);

            res.json({ message: 'Password reset successfully' });
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An unexpected error occurred while resetting the password.' });
    }
};