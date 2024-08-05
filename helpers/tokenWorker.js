const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken } = require('../helpers/tokenUtils');
const jwt = require('jsonwebtoken');

async function checkAndRefreshTokens() {
    try {
        const tokens = await RefreshToken.findAll();

        if (!tokens || tokens.length === 0) {
            //console.log('No tokens found.');
            return;
        }

        const now = new Date();

        for (const tokenRecord of tokens) {
            if (tokenRecord.expiresAt < now) {
                // Refresh token süresi dolmuşsa
                await RefreshToken.destroy({ where: { id: tokenRecord.id } });
                console.log(`Expired refresh token deleted for user ${tokenRecord.userID}`);
            } else {
                // Refresh token süresi dolmamışsa, access token süresini kontrol et
                try {
                    const user = jwt.verify(tokenRecord.token, process.env.REFRESH_TOKEN_SECRET);
                    const newAccessToken = generateAccessToken({ userID: user.userID });
                    const newRefreshToken = generateRefreshToken({ userID: user.userID });

                    // Tokenları güncelle
                    tokenRecord.accessToken = newAccessToken;
                    tokenRecord.token = newRefreshToken;
                    tokenRecord.expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 gün sonrası

                    await tokenRecord.save();
                    console.log(`Tokens refreshed for user ${user.userID}`);
                } catch (err) {
                    console.error(`Error refreshing tokens for user ${tokenRecord.userID}:`, err);
                }
            }
        }
    } catch (error) {
        console.error('Error checking and refreshing tokens:', error);
    }
}

// Her saat başı tokenları kontrol eden ve gerektiğinde yenileyen worker
setInterval(checkAndRefreshTokens, 60 * 60 * 1000); // 1 saat

module.exports = checkAndRefreshTokens;