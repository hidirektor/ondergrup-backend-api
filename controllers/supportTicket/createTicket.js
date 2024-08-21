const SupportTicket = require('../../models/SupportTicket');
const User = require('../../models/User');

/**
 * @swagger
 * /createTicket:
 *   post:
 *     summary: Create a new support ticket
 *     description: Creates a new support ticket with an initial response based on the owner's details.
 *     tags:
 *       - Support Tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerID:
 *                 type: string
 *                 description: The ID of the ticket owner (userID).
 *                 example: "1234"
 *               title:
 *                 type: string
 *                 description: The title of the support ticket.
 *                 example: "Issue with logging in"
 *               subject:
 *                 type: string
 *                 description: The subject of the support ticket.
 *                 example: "Login Issue"
 *               ticketStatus:
 *                 type: string
 *                 description: The current status of the support ticket.
 *                 example: "Open"
 *               desc:
 *                 type: string
 *                 description: The initial comment or description of the issue.
 *                 example: "User is unable to log in with correct credentials."
 *     responses:
 *       201:
 *         description: Support ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to create ticket
 */

module.exports = async (req, res) => {
    try {
        const { ownerID, title, subject, desc } = req.body;

        const user = await User.findOne({ where: { userID: ownerID } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const initialResponse = {
            userID: ownerID,
            userName: user.userName,
            nameSurname: user.nameSurname,
            commentDate: Math.floor(Date.now() / 1000),
            comment: desc
        };

        const newTicket = await SupportTicket.create({
            ownerID,
            title,
            subject,
            ticketStatus: 'Created',
            responses: JSON.stringify({ responses: [initialResponse] })
        });

        return res.status(201).json(newTicket);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create ticket' });
    }
};