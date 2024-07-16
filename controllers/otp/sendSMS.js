const axios = require('axios');
const OTPLog = require('../../models/OTPLog');
const Users = require('../../models/User');
const https = require('https');
const xml2js = require('xml2js');
const moment = require('moment');

/**
 * @swagger
 * /sendSMS:
 *   post:
 *     summary: Send an OTP via SMS to the user's phone number
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
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 otpSent:
 *                   type: integer
 *                   description: The UNIX timestamp when the OTP was sent
 *                   example: 1628070943
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid userID or phone number. User not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error sending SMS"
 *                 error:
 *                   type: object
 *                   description: Detailed error response from Netgsm API
 */

module.exports = async (req, res) => {
    const { userName } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpSent = moment().unix();

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid userID or phone number. User not found.' });
        }

        const userID = user.userID;
        const phoneNumber = user.phoneNumber;

        const xmlBody = `
            <?xml version="1.0"?>
            <mainbody>
                <header>
                    <usercode>${process.env.NETGSM_USERCODE}</usercode>
                    <password>${process.env.NETGSM_PASSWORD}</password>
                    <msgheader>${process.env.NETGSM_MSGHEADER}</msgheader>
                    <appkey>${process.env.NETGSM_APPKEY}</appkey>
                </header>
                <body>
                    <msg><![CDATA[${otpCode}]]></msg>
                    <no>${phoneNumber}</no>
                </body>
            </mainbody>
        `;

        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        const response = await axios.post('https://api.netgsm.com.tr/sms/send/otp', xmlBody, {
            headers: {
                'Content-Type': 'application/xml'
            },
            httpsAgent: agent
        });

        const result = await xml2js.parseStringPromise(response.data);
        if (result.mainbody && result.mainbody.header[0].status[0] === '00') {
            await OTPLog.create({ userID, otpType: 'sms', otpCode, otpSent });
            res.json({ otpSent });
        } else {
            res.status(500).json({ message: 'Error sending SMS', error: result });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};