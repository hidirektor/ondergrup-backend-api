const MachineError = require('../../models/MachineError');

/**
 * @swagger
 * /getErrors:
 *   get:
 *     summary: Retrieve all errors for a specific machine
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
 *         description: A list of machine errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved machine errors.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     machineErrors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MachineError'
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
 *         description: No machine errors found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No machine errors found for this machine"
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

        const machineErrors = await MachineError.findAll({ where: { machineID } });

        if (!machineErrors.length) {
            return res.status(404).json({ message: 'No machine errors found for this machine' });
        }

        return res.status(200).json({ message: 'Successfully retrieved machine errors.', payload: { machineErrors } });
    } catch (error) {
        console.error('Error retrieving machine errors', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};