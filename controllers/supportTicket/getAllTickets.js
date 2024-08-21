const SupportTicket = require('../../models/SupportTicket');

/**
 * @swagger
 * /getAllTickets:
 *   get:
 *     summary: Retrieve all support tickets
 *     description: Fetch all support tickets from the database.
 *     tags:
 *       - Support Tickets
 *     responses:
 *       200:
 *         description: A list of support tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupportTicket'
 *       500:
 *         description: Failed to retrieve tickets
 */

module.exports = async (req, res) => {
    try {
        const tickets = await SupportTicket.findAll();

        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
};