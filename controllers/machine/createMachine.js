const Machine = require('../../models/Machine');
const ActionLog = require("../../models/ActionLog");

/**
 * @swagger
 * /createMachine:
 *   post:
 *     summary: Add a new machine
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
 *               machineType:
 *                 type: string
 *                 description: The type of the machine
 *                 example: "TypeA"
 *     responses:
 *       201:
 *         description: Machine added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Machine added successfully."
 *                 payload:
 *                   type: object
 *                   properties:
 *                     machine:
 *                       $ref: '#/components/schemas/Machine'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
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
        const { machineID, machineType } = req.body;

        if (!machineID || !machineType) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingMachine = await Machine.findOne({ where: { machineID } });
        if (existingMachine) {
            return res.status(400).json({ message: 'Machine with this ID already exists' });
        }

        const machine = await Machine.create({
            machineID,
            machineType,
            createdAt: Math.floor(Date.now() / 1000),
            lastUpdate: null,
        });

        res.status(201).json({ message: 'Machine added successfully.', payload: { machine } });
    } catch (error) {
        console.error('Error adding machine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};