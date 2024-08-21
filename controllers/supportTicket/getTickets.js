const SupportTicket = require('../../models/SupportTicket');

/**
 * @swagger
 * /getTickets:
 *   post:
 *     summary: Retrieve support tickets
 *     description: Fetch all support tickets or filter by user ID.
 *     tags:
 *       - Support Tickets
 *     parameters:
 *       - in: query
 *         name: userID
 *         schema:
 *           type: string
 *         description: The ID of the user to filter tickets by.
 *     responses:
 *       200:
 *         description: A list of support tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupportTicket'
 *       404:
 *         description: Size ait destek talebi bulunamadı
 *       500:
 *         description: Failed to retrieve tickets
 */

module.exports = async (req, res) => {
    try {
        const { userID } = req.query;

        let tickets;
        if (userID) {
            tickets = await SupportTicket.findAll({ where: { ownerID: userID } });
            if (tickets.length === 0) {
                return res.status(404).json({ error: 'Size ait destek talebi bulunamadı' });
            }
        } else {
            return res.status(404).json({ error: 'Size ait destek talebi bulunamadı' });
        }

        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
};