const SupportTicket = require('../../models/SupportTicket');

/**
 * @swagger
 * /closeTicket:
 *   post:
 *     summary: Close a support ticket
 *     description: Close a support ticket by its ID.
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
 *                 description: The ID of the ticket to close.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Ticket closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket closed successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Failed to close ticket
 */

module.exports = async (req, res) => {
    try {
        const { id } = req.body;

        const ticket = await SupportTicket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        ticket.status = "Closed";
        await ticket.save();

        return res.status(200).json({ message: 'Ticket closed successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to close ticket' });
    }
};