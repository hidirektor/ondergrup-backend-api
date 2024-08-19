const { generateAccessToken } = require('../helpers/tokenUtils');
const jwt = require('jsonwebtoken');
const redisClient = require('../helpers/redisClient');

async function checkAndRefreshTokens() {
    try {
        await redisClient.keys('*', async (err, keys) => {
            if (err) {
                console.error('Redis error:', err);
                return;
            }

            if (!keys || keys.length === 0) {
                return;
            }

            const now = new Date();

            for (const token of keys) {
                await redisClient.get(token, async (err, data) => {
                    if (err || !data) {
                        console.error('Error fetching token data:', err);
                        return;
                    }

                    const decoded = jwt.verify(token, process.env.JWT_SECRET, {ignoreExpiration: true});
                    const expiration = new Date(decoded.exp * 1000);

                    if (expiration < now) {
                        const newAccessToken = generateAccessToken({userID: decoded.userID});
                        await redisClient.del(token, (err) => {
                            if (err) console.error('Redis error:', err);
                        });
                        await redisClient.set(newAccessToken, JSON.stringify({userID: decoded.userID}), 'EX', 86400);
                        console.log(`Access token refreshed for user ${decoded.userID}`);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error checking and refreshing tokens:', error);
    }
}

setInterval(checkAndRefreshTokens, 60 * 60 * 1000); // 1 saat

module.exports = checkAndRefreshTokens;