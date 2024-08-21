const SupportTicket = require('../../models/SupportTicket');

/**
 * @swagger
 * /deleteTicket:
 *   delete:
 *     summary: Delete a support ticket
 *     description: Delete a support ticket by its ID.
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
 *                 description: The ID of the ticket to delete.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Failed to delete ticket
 */

module.exports = async (req, res) => {
    try {
        const { id } = req.body;

        const ticket = await SupportTicket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        await ticket.destroy();

        return res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete ticket' });
    }
};