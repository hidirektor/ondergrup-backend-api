const jwt = require('jsonwebtoken');
const redisClient = require('./redisClient');

const generateAccessToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    redisClient.set(token, JSON.stringify(payload), 'EX', 86400); // 1 gün
    return token;
};

const generateRefreshToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
    redisClient.set(token, JSON.stringify(payload), 'EX', 604800); // 7 gün (bir hafta)
    return token;
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        redisClient.get(token, (err, data) => {
            if (err || !data) {
                return reject('Token not found');
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return reject('Token invalid');
                resolve(decoded);
            });
        });
    });
};

const invalidateToken = (token) => {
    return new Promise((resolve) => {
        redisClient.del(token, (err) => {
            if (err) console.error('Redis error:', err);
            resolve();
        });
    });
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken, invalidateToken };