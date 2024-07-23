const OTPLog = require('../../models/OTPLog');
const Users = require('../../models/User');
const moment = require('moment');

/**
 * @swagger
 * /verifyOTP:
 *   post:
 *     summary: Verify the OTP sent to the user
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The user's username
 *                 example: "john_doe"
 *               otpCode:
 *                 type: string
 *                 description: The OTP code received by the user
 *                 example: "123456"
 *               otpSent:
 *                 type: integer
 *                 description: The UNIX timestamp when the OTP was sent
 *                 example: 1628070943
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *       400:
 *         description: Invalid OTP code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP code."
 *       404:
 *         description: User not found or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP or OTP has expired."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred while verifying OTP."
 */

module.exports = async (req, res) => {
    const { userName, otpCode, otpSentTime } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userID = user.userID;
        const otpEntry = await OTPLog.findOne({ where: { userID, otpSentTime } });

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