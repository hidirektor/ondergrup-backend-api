const Users = require('../../models/User');
const RefreshToken = require('../../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../../config/jwt');

module.exports = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

        const accessToken = generateAccessToken({ userID: user.userID });
        const refreshToken = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET);

        await RefreshToken.destroy({ where: { userID: user.userID } });

        await RefreshToken.create({ token: refreshToken, userID: user.userID });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error logging in:', error);
        if (error.name === 'SequelizeDatabaseError') {
            res.status(500).json({ message: 'Database error during login' });
        } else if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ message: 'Validation error during login' });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred during login' });
        }
    }
};