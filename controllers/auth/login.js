const Users = require('../../models/User');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, invalidateToken, findRefreshToken} = require('../../helpers/tokenUtils');
const redisClient = require('../../helpers/redisClient');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully logged in :)'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: string
 *                       description: The ID of the user
 *                     userType:
 *                       type: string
 *                       description: The Role of user
 *                     accessToken:
 *                       type: string
 *                       description: Access token for user authentication
 *                     refreshToken:
 *                       type: string
 *                       description: Refresh token for user authentication
 *       400:
 *         description: Validation error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error during login
 *       401:
 *         description: Unauthorized, invalid credentials or inactive account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidPassword:
 *                       summary: Invalid password
 *                       value: Invalid password
 *                     inactiveAccount:
 *                       summary: User account is inactive
 *                       value: User account is inactive
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
 *       500:
 *         description: Database error during login or unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 examples:
 *                   databaseError:
 *                     summary: Database error
 *                     value: Database error during login
 *                   unexpectedError:
 *                     summary: Unexpected error
 *                     value: An unexpected error occurred during login
 */

module.exports = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

        if (!user.isActive) return res.status(401).json({ message: 'User account is inactive' });

        let accessToken = await generateAccessToken({ userID: user.userID });
        let refreshToken = await findRefreshToken(user.userID);
        if (!refreshToken) {
            refreshToken = await generateRefreshToken({ userID: user.userID });
        }

        res.json({
            message: 'Successfully logged in :)',
            payload: {
                userID: user.userID,
                userType: user.userType,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        if (error.name === 'SequelizeDatabaseError') {
            res.status(500).json({ message: 'Database error during login' });
        } else if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ message: 'Validation error during login' });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred during login' });
        }
    }
};