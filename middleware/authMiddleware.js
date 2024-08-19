const { verifyToken } = require('../helpers/tokenUtils');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    try {
        const decoded = await verifyToken(token);
        req.user = {
            userID: decoded.userID,
            userType: decoded.userType,
        };
        next();
    } catch (err) {
        console.error('Error in authMiddleware', err);
        res.sendStatus(403); // Forbidden
    }
};