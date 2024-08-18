const Machine = require('../../models/Machine');
const Users = require("../../models/User");
const {createActionLog} = require("../../helpers/logger/actionLog");

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
 *                   example: "Machine ownerID updated successfully."
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
        const { machineID, ownerID } = req.body;

        if (!machineID || !ownerID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = Users.findOne({ where: { userID: ownerID } });

        const existingMachine = await Machine.findOne({ where: { machineID } });
        if (!existingMachine) {
            return res.status(404).json({ message: 'Machine not found' });
        }

        await existingMachine.update({ ownerID });

        res.status(201).json({ message: 'Machine ownerID updated successfully.', payload: { existingMachine } });
    } catch (error) {
        console.error('Error adding machine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};