const jwt = require('jsonwebtoken');
const redisClient = require('./redisClient');

const generateAccessToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    await redisClient.set(token, JSON.stringify(payload));
    await redisClient.expire(token, 86400); // 86400 saniye (1 gün)
    return token;
};

const generateRefreshToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
    await redisClient.set(token, JSON.stringify(payload));
    await redisClient.expire(token, 604800); // 604800 saniye (7 gün)
    return token;
};

const verifyToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await redisClient.get(token);
            if (!data) {
                return reject('Token not found in Redis');
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.error('JWT verify error:', err);
                    return reject('Token invalid');
                }
                resolve(decoded);
            });
        } catch (err) {
            console.error('Redis get error:', err);
            reject('Token not found');
        }
    });
};

const invalidateToken = async (token) => {
    try {
        await redisClient.del(token);
    } catch (err) {
        console.error('Redis error:', err);
    }
};

const refreshAccessToken = async (userID, userType) => {
    try {
        // Önceki token'ları sil
        const keys = await redisClient.keys('*');
        const deletePromises = keys.map(async (token) => {
            const data = await redisClient.get(token);
            if (data) {
                const tokenData = JSON.parse(data);
                if (tokenData.userID === userID) {
                    await invalidateToken(token);
                }
            }
        });
        await Promise.all(deletePromises);

        // Yeni AccessToken oluştur ve Redis'e kaydet
        const accessToken = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await redisClient.set(accessToken, JSON.stringify({ userID, userType }));
        await redisClient.expire(accessToken, 86400); // 86400 saniye (1 gün)

        return accessToken;
    } catch (err) {
        console.error('Error refreshing access token:', err);
        throw new Error('Token refresh failed');
    }
};

const findRefreshToken = async (userID) => {
    try {
        const keys = await redisClient.keys('*');
        for (const token of keys) {
            const data = await redisClient.get(token);
            if (data) {
                const tokenData = JSON.parse(data);
                if (tokenData.userID === userID && jwt.verify(token, process.env.JWT_REFRESH_SECRET)) {
                    return token;
                }
            }
        }
        return null; // Eğer mevcut bir refresh token bulunamazsa
    } catch (err) {
        console.error('Error finding refresh token:', err);
        throw new Error('Refresh token lookup failed');
    }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken, invalidateToken, refreshAccessToken, findRefreshToken };