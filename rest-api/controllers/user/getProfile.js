const Users = require('../../models/User');
const UserPreferences = require('../../models/UserPreferences');

module.exports = async (req, res) => {
    const { userID } = req.body;

    const user = await Users.findOne({ where: { userID } });
    const userPreferences = await UserPreferences.findOne({ where: { userID } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user, userPreferences });
};