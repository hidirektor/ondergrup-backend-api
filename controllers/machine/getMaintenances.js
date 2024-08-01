const MachineMaintenance = require('../../models/Maintenance');

/**
 * @swagger
 * /getMaintenances:
 *   get:
 *     summary: Retrieve all maintenances for a specific machine
 *     tags: [Machine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machineID:
 *                 type: string
 *                 description: The ID of the machine
 *                 example: "M1234"
 *     responses:
 *       200:
 *         description: A list of maintenances for the machine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved maintenances.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     machineMaintenances:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "machineID is required"
 *       404:
 *         description: No maintenances found for the machine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No maintenances found for this machine"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

module.exports = async (req, res) => {
    try {
        const { machineID } = req.body;

        if (!machineID) {
            return res.status(400).json({ message: 'machineID is required' });
        }

        const machineMaintenances = await MachineMaintenance.findAll({ where: { machineID } });

        if (!machineMaintenances.length) {
            return res.status(404).json({ message: 'No maintenances found for this machine' });
        }

        return res.status(200).json({ message: 'Successfully retrieved maintenances.', payload: { machineMaintenances } });
    } catch (error) {
        console.error('Error retrieving machine maintenances', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};