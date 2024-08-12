const ActionLogs = require('../../../models/ActionLog');

/**
 * @swagger
 * /getAllActions:
 *   get:
 *     summary: Get all action logs
 *     tags: [Authorized]
 *     responses:
 *       200:
 *         description: List of all action logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all action logs.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActionLog'
 *       404:
 *         description: No active action log found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No active action log found in the database.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

module.exports = async (req, res) => {
    try {
        const logs = await ActionLogs.findAll({});
        if (!logs.length) {
            return res.status(404).json({ message: 'No action log found in the database.' });
        }

        res.status(200).json({ message: 'Successfully retrieved all action logs.', payload: { logs } });
    } catch (error) {
        console.log('Error retrieving all users', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};