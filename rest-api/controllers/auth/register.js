const Users = require('../../models/User');
const UserPreferences = require('../../models/UserPreferences');
const bcrypt = require('bcryptjs');
const generateUserID = require('../../helpers/userIDGenerator');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
    const {
        userName, userType, nameSurname, eMail, phoneNumber, companyName, password
    } = req.body;

    try {
        let userID = generateUserID();
        let userExists = await Users.findOne({ where: { userID } });

        while (userExists) {
            userID = generateUserID();
            userExists = await Users.findOne({ where: { userID } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            userID, userName, userType, nameSurname, eMail, phoneNumber, companyName, password: hashedPassword
        });

        await UserPreferences.create({
            userID,
            language: true,
            nightMode: false
        });

        res.json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            const message = field === 'userName' ? 'Username is already taken' : field === 'eMail' ? 'Email is already registered' : 'Unique constraint error';
            res.status(400).json({ message });
        } else if (error.name === 'SequelizeValidationError') {
            const message = error.errors.map(e => e.message).join(', ');
            res.status(400).json({ message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred while registering user' });
        }
    }
};