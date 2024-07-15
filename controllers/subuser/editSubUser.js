const SubUser = require('../../models/SubUser');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    try {
        const { id, ownerID, userID, userName, userType, nameSurname, eMail, phoneNumber, companyName, password } = req.body;

        if (!id || !ownerID || !userID || !userName || !userType || !nameSurname || !eMail || !phoneNumber || !companyName) {
            return res.status(400).json({ message: 'All fields except password are required' });
        }

        const subUser = await SubUser.findOne({ where: { id } });
        if (!subUser) {
            return res.status(404).json({ message: 'SubUser not found' });
        }

        const owner = await User.findOne({ where: { userID: ownerID } });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        const user = await User.findOne({ where: { userID } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.userName = userName;
        user.userType = userType;
        user.nameSurname = nameSurname;
        user.eMail = eMail;
        user.phoneNumber = phoneNumber;
        user.companyName = companyName;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        subUser.ownerID = ownerID;
        subUser.userID = userID;

        await subUser.save();

        res.status(200).json({ message: 'SubUser updated successfully', subUser, user });
    } catch (error) {
        console.error('Error updating SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
