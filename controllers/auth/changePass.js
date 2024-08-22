const Users = require('../../models/User');
const bcrypt = require('bcryptjs');
const redisClient = require('../../helpers/redisClient');
const { invalidateToken } = require('../../helpers/tokenUtils');
const { invalidateAllTokens } = require('../../helpers/tokenUtils');

/**
 * @swagger
 * /changePass:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - oldPassword
 *               - newPassword
 *               - closeSessions
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *               closeSessions:
 *                 type: boolean
 *                 description: Session closer identifier
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Invalid request or password change policy violation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password can only be changed once every 7 days
 *       401:
 *         description: Unauthorized, invalid credentials, or user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid current password
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
 */

module.exports = async (req, res) => {
    const { userName, oldPassword, newPassword, closeSessions } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid current password' });

        // Kullanıcının Redis'te token'ı olup olmadığını kontrol et
        redisClient.keys('*', async (err, keys) => {
            if (err) {
                console.error('Redis error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            let isAuthenticated = false;
            for (const token of keys) {
                redisClient.get(token, (err, data) => {
                    if (err || !data) {
                        console.error('Error fetching token data:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    const tokenData = JSON.parse(data);
                    if (tokenData.userID === user.userID) {
                        isAuthenticated = true;
                    }
                });
            }

            if (!isAuthenticated) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (user.lastPasswordChange && (currentTime - user.lastPasswordChange) < 7 * 24 * 60 * 60) {
                return res.status(400).json({ message: 'Password can only be changed once every 7 days' });
            }

            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({ message: 'New password cannot be the same as the old password' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            user.lastPasswordChange = currentTime;
            await user.save();

            // Şifre değiştikten sonra, kullanıcının mevcut tüm token'larını geçersiz kıl
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

            if (closeSessions) {
                await invalidateAllTokens(user.userID);
            }

            res.json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};