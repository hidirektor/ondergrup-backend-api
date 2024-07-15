const OTPLog = require('../../models/OTPLog');
const Users = require('../../models/User');
const moment = require('moment');

module.exports = async (req, res) => {
    const { userName, otpCode, otpSent } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userID = user.userID;
        const otpEntry = await OTPLog.findOne({ where: { userID, otpSent } });

        if (!otpEntry) {
            return res.status(404).json({ message: 'Invalid OTP or OTP has expired.' });
        }

        if (otpEntry.otpCode !== otpCode) {
            return res.status(400).json({ message: 'Invalid OTP code.' });
        }

        otpEntry.otpValidate = moment().unix();
        await otpEntry.save();

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'An unexpected error occurred while verifying OTP.' });
    }
};