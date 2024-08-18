const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userID;

        const user = await User.findOne({ where: { userID } });
        const userType = user.userType;
        if (!user) {
            return res.sendStatus(401); // Unauthorized
        }

        req.user = {
            userID,
            userType
        };

        next();
    } catch (err) {
        console.error('Error in authMiddleware', err);
        res.sendStatus(403); // Forbidden
    }
};