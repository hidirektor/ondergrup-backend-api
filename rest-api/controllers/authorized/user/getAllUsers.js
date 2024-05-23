const Users = require('../../../models/User');

module.exports = async (req, res) => {
    try {
        const users = await Users.findAll({ where: { isDeleted: false } });
        if (!users.length) {
            return res.status(404).json({ message: 'No users found in the database.' });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.log('Error retrieving all users', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};