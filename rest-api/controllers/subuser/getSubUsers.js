const SubUser = require('../../models/SubUser');
const User = require('../../models/User');

module.exports = async (req, res) => {
    try {
        const { ownerID } = req.body;

        if (!ownerID) {
            return res.status(400).json({ message: 'ownerID is required' });
        }

        const subUsers = await SubUser.findAll({ where: { ownerID } });

        if (!subUsers.length) {
            return res.status(404).json({ message: 'No sub-users found for this owner' });
        }

        const userIDs = subUsers.map(subUser => subUser.userID);
        const users = await User.findAll({ where: { userID: userIDs } });

        res.status(200).json({ subUsers, users });
    } catch (error) {
        console.error('Error retrieving sub-users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
