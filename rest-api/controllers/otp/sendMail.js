const nodemailer = require('nodemailer');
const OTPLog = require('../../models/OTPLog');
const Users = require('../../models/User');
const generateOtpEmailContent = require('../../helpers/generateOtpEmailContent');
const moment = require('moment');

module.exports = async (req, res) => {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpSent = moment().unix();

    try {
        const user = await Users.findOne({ where: { eMail: email } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email. User not found.' });
        }

        const userID = user.userID;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: process.env.EMAIL_SUBJECT,
            html: generateOtpEmailContent(otpCode),
            attachments: [{
                filename: 'ondergrup.png',
                path: "https://i.hizliresim.com/i3ge8yy.png",
                cid: 'ondergrupMain'
            }]
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
            }

            try {
                await OTPLog.create({ userID, otpType: 'mail', otpCode, otpSent });
                res.json({ otpSent });
            } catch (logError) {
                console.error('Error logging OTP:', logError);
                res.status(500).json({ message: 'Failed to log OTP. Please try again later.' });
            }
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};