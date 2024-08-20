const express = require('express');
const router = express.Router();
const Users = require('../../../models/User');
const sendBulkMail = require('../../../helpers/rabbitmq/sendBulkMail');

/**
 * @swagger
 * /sendAlertMail:
 *   post:
 *     summary: Send alert mail to all users
 *     tags: [Alert]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - desc
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the alert
 *               desc:
 *                 type: string
 *                 description: The description of the alert
 *     responses:
 *       200:
 *         description: Alert mail sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Alert mail sent successfully'
 *       500:
 *         description: An unexpected error occurred while sending alert mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'An unexpected error occurred while sending alert mail'
 */

module.exports = async (req, res) => {
    const { title, desc } = req.body;

    try {
        const users = await Users.findAll({
            attributes: ['eMail', 'nameSurname']
        });

        const userEmails = users.map(user => ({ email: user.eMail, name: user.nameSurname }));

        await sendBulkMail(title, desc, userEmails);

        res.status(200).json({ message: 'Alert mail sent successfully' });
    } catch (error) {
        console.error('Error sending alert mail:', error);
        res.status(500).json({ message: 'An unexpected error occurred while sending alert mail' });
    }
};