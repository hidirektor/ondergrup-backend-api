const { verifyToken } = require('../helpers/tokenUtils');

module.exports = (roles = []) => {
    return async (req, res, next) => {
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

            if (roles.length > 0 && !roles.includes(req.user.userType)) {
                return res.sendStatus(403); // Forbidden
            }

            next();
        } catch (err) {
            console.error('Error in roleMiddleware', err);
            res.sendStatus(403); // Forbidden
        }
    };
};