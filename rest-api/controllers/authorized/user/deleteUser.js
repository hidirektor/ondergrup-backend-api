const Users = require('../../../models/User');

module.exports = async (req, res) => {
    const { userName } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userID = user.userID;

    await user.delete();

    res.json({ message: 'User deleted successfully' });
};