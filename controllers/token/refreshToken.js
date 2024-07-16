const jwt = require('jsonwebtoken');
const RefreshToken = require('../../models/RefreshToken');
const { generateAccessToken } = require('../../config/jwt');

/**
 * @swagger
 * /refreshToken:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token to generate new access token
 *                 example: "refresh_token_string"
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Missing refresh token
 *       403:
 *         description: Forbidden - Invalid refresh token or token expired
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

module.exports = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.sendStatus(401);

    try {
        const refreshToken = await RefreshToken.findOne({ where: { token } });
        if (!refreshToken) return res.sendStatus(403);

        const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken({ userID: user.userID });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.sendStatus(403);
    }
};