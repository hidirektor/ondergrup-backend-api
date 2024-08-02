const Machines = require('../../models/Machine');
const MachineData = require('../../models/MachineData');

/**
 * @swagger
 * /updateMachine:
 *   post:
 *     summary: Update or create machine data
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
 *               updateData:
 *                 type: object
 *                 description: Data to update or create for the machine
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Machine data updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Machine data updated."
 *                 payload:
 *                   type: object
 *                   properties:
 *                     updatedMachine:
 *                       $ref: '#/components/schemas/MachineData'
 *       201:
 *         description: Machine data created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Machine data created."
 *                 payload:
 *                   type: object
 *                   properties:
 *                     newMachineData:
 *                       $ref: '#/components/schemas/MachineData'
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
        const { machineID, updateData } = req.body;

        if (!machineID) {
            return res.status(400).json({ message: 'machineID is required' });
        }

        const machineExists = await Machines.findOne({ where: { machineID } });
        if (!machineExists) {
            return res.status(404).json({ message: 'Machine not found.' });
        }

        const machineData = await MachineData.findOne({ where: { machineID } });
        if (!machineData) {
            const newMachineData = await MachineData.create({
                machineID,
                ...updateData
            });
            await Machines.update({ lastUpdate: Math.floor(Date.now() / 1000) }, { where: { machineID } });

            return res.status(201).json({ message: 'Machine data created.', payload: { newMachineData } });
        } else {
            await MachineData.update(updateData, { where: { machineID } });
            const updatedMachine = await MachineData.findOne({ where: { machineID } });
            await Machines.update({ lastUpdate: Math.floor(Date.now() / 1000) }, { where: { machineID } });

            return res.status(200).json({ message: 'Machine data updated.', payload: { updatedMachine } });
        }
    } catch (error) {
        console.error('Error updating machine data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};