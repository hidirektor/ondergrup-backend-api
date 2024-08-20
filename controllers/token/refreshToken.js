const jwt = require('jsonwebtoken');
const redisClient = require('../../helpers/redisClient');
const { generateAccessToken } = require('../../helpers/tokenUtils');

module.exports = async (req, res) => {
    const { userID, accessToken, refreshToken } = req.body;

    if (!userID || !refreshToken || !accessToken) return res.sendStatus(401);

    try {
        // Refresh token'ı Redis'ten al
        redisClient.get(refreshToken, (err, data) => {
            if (err || !data) {
                return res.sendStatus(403); // Token bulunamadı
            }

            const tokenData = JSON.parse(data);

            // Token verilerini kontrol et
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET, { ignoreExpiration: true });

            if (decodedAccessToken.userID !== decoded.userID || decoded.userID !== userID || tokenData.userID !== userID) {
                return res.sendStatus(403);
            }

            // Yeni bir access token oluştur, userType'ı da ekleyelim
            const newAccessToken = generateAccessToken({ userID: decoded.userID, userType: tokenData.userType });

            // Yeni access token'ı Redis'te sakla
            redisClient.set(newAccessToken, JSON.stringify({ userID: decoded.userID, userType: tokenData.userType }), 'EX', 86400); // 1 gün

            // Eski access token'ı geçersiz kıl (isteğe bağlı)
            redisClient.del(accessToken, (err) => {
                if (err) {
                    console.error('Error deleting old access token:', err);
                }
            });

            res.json({ message: 'Successfully generated access token.', payload: { accessToken: newAccessToken } });
        });
    } catch (error) {
        res.sendStatus(403);
    }
};