const SupportTicket = require('../../models/SupportTicket');
const User = require('../../models/User');

/**
 * @swagger
 * /responseTicket:
 *   post:
 *     summary: Add a response to a support ticket
 *     description: Adds a new response to an existing support ticket. The user information is retrieved based on the provided userID.
 *     tags:
 *       - Support Tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the ticket to respond to.
 *                 example: 1
 *               userID:
 *                 type: string
 *                 description: The ID of the user adding the response.
 *                 example: "1234"
 *               comment:
 *                 type: string
 *                 description: The comment or response text.
 *                 example: "I have resolved the issue."
 *     responses:
 *       200:
 *         description: Response added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 *       404:
 *         description: Ticket or User not found
 *       500:
 *         description: Failed to add response to ticket
 */

module.exports = async (req, res) => {
    try {
        const { id, userID, comment } = req.body;

        const ticket = await SupportTicket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const user = await User.findOne({ where: { userID: userID } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.userType === 'NORMAL') {
            ticket.ticketStatus = 'Customer Response';
        } else {
            ticket.ticketStatus = 'Answered';
        }

        const responses = JSON.parse(ticket.responses);
        responses.responses.push({
            userID,
            userName: user.userName,
            nameSurname: user.nameSurname,
            commentDate: Math.floor(Date.now() / 1000),
            comment
        });

        ticket.responses = JSON.stringify(responses);
        await ticket.save();

        return res.status(200).json(ticket);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add response to ticket' });
    }
};