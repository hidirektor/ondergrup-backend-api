const Machine = require('../../models/Machine');

/**
 * @swagger
 * /checkMachineID:
 *   get:
 *     summary: Check if a machine exists by machineID
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
 *                 description: The ID of the machine to check
 *                 example: "M1234"
 *     responses:
 *       200:
 *         description: Machine exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Machine exists"
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
 *         description: Machine not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Machine not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

module.exports = async (req, res) => {
    try {
        const { machineID } = req.body;

        if (!machineID) {
            return res.status(400).json({ message: 'machineID is required' });
        }

        const machine = await Machine.findOne({ where: { machineID } });

        if (machine) {
            return res.status(200).json({ exists: true, message: 'Machine exists' });
        } else {
            return res.status(404).json({ exists: false, message: 'Machine not found' });
        }
    } catch (error) {
        console.error('Error checking machine ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};