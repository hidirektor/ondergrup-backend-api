const Users = require('../../models/User');

module.exports = async (req, res) => {
    const { userID, userData } = req.body;

    const user = await Users.findOne({ where: { userID } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update(userData);

    res.json({ message: 'Profile updated successfully' });
};