const SubUser = require('../../models/SubUser');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    try {
        const { ownerID, userID, userName, userType, nameSurname, eMail, phoneNumber, companyName, password } = req.body;

        if (!ownerID || !userID || !userName || !userType || !nameSurname || !eMail || !phoneNumber || !companyName || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const owner = await User.findOne({ where: { userID: ownerID } });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        const existingUser = await User.findOne({ where: { [Sequelize.Op.or]: [{ userID }, { userName }, { eMail }] } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this userID, userName, or eMail already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userID,
            userName,
            userType,
            nameSurname,
            eMail,
            phoneNumber,
            companyName,
            password: hashedPassword
        });

        const subUser = await SubUser.create({
            ownerID,
            userID,
        });

        res.status(201).json({ message: 'SubUser created successfully', subUser, newUser });
    } catch (error) {
        console.error('Error creating SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
