const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken } = require('../helpers/tokenUtils');
const jwt = require('jsonwebtoken');

async function checkAndRefreshTokens() {
    try {
        const tokens = await RefreshToken.findAll();

        if (!tokens || tokens.length === 0) {
            return;
        }

        const now = new Date();

        for (const tokenRecord of tokens) {
            const decoded = jwt.verify(tokenRecord.accessToken, process.env.JWT_SECRET, { ignoreExpiration: true });
            const expiration = new Date(decoded.exp * 1000);

            if (expiration < now) {
                const newAccessToken = generateAccessToken({ userID: decoded.userID });
                tokenRecord.accessToken = newAccessToken;
                await tokenRecord.save();
                console.log(`Access token refreshed for user ${decoded.userID}`);
            }
        }
    } catch (error) {
        console.error('Error checking and refreshing tokens:', error);
    }
}

setInterval(checkAndRefreshTokens, 60 * 60 * 1000); // 1 saat

module.exports = checkAndRefreshTokens;