const Users = require('../../../models/User');

module.exports = async (req, res) => {
    const { userName, newRole } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.userType = newRole;
    await user.save();

    res.json({ message: 'User role updated successfully' });
};