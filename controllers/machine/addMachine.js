const Machine = require('../../models/Machine');

/**
 * @swagger
 * /addMachine:
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
 *               ownerID:
 *                 type: string
 *                 description: The ID of the owner
 *                 example: "O5678"
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
 *                   example: "Machine added successfully"
 *                 machine:
 *                   $ref: '#/components/schemas/Machine'
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
        const { machineID, ownerID, machineType } = req.body;

        if (!machineID || !ownerID || !machineType) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingMachine = await Machine.findOne({ where: { machineID } });
        if (existingMachine) {
            return res.status(400).json({ message: 'Machine with this ID already exists' });
        }

        const machine = await Machine.create({
            machineID,
            ownerID,
            machineType,
            createdAt: Math.floor(Date.now() / 1000),
            lastUpdate: null,
        });

        res.status(201).json({ message: 'Machine added successfully', machine });
    } catch (error) {
        console.error('Error adding machine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};