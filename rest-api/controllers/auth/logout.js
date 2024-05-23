const RefreshToken = require('../../models/RefreshToken');

module.exports = async (req, res) => {
    const { token } = req.body;

    try {
        const refreshToken = await RefreshToken.findOne({ where: { token } });
        if (!refreshToken) {
            return res.status(404).json({ message: 'Token not found' });
        }

        await RefreshToken.destroy({ where: { token } });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
};