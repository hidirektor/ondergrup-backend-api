const SubUser = require('../../models/SubUser');
const User = require('../../models/User');

module.exports = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        const subUser = await SubUser.findOne({ where: { id } });
        if (!subUser) {
            return res.status(404).json({ message: 'SubUser not found' });
        }

        const user = await User.findOne({ where: { userID: subUser.userID } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await subUser.destroy();
        await user.destroy();

        res.status(200).json({ message: 'SubUser and associated User deleted successfully' });
    } catch (error) {
        console.error('Error deleting SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
