const Machine = require('../../../models/Machine');

/**
 * @swagger
 * /getAllMachines:
 *   get:
 *     summary: Retrieve all machines
 *     tags: [Machine]
 *     responses:
 *       200:
 *         description: A list of all machines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all machines.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     machines:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Machine'
 *       404:
 *         description: No machines found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No any machines found on database.
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
        const machines = await Machine.findAll();
        if (!machines.length) {
            return res.status(404).json({ message: 'No any machines found on database.' });
        }

        res.status(200).json({ message: 'Successfully retrieved all machines.', payload: { machines } });
    } catch (error) {
        console.log('Error retrieving all machines', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};