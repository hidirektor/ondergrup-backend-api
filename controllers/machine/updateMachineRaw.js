const MachineData = require('../../models/MachineData');

/**
 * @swagger
 * /updateMachineRaw:
 *   put:
 *     summary: Update or create machine data
 *     tags: [Machine]
 *     parameters:
 *       - in: query
 *         name: machineID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the machine
 *         example: "M1234"
 *       - in: query
 *         name: updateData
 *         schema:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         description: Data to update or create for the machine
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
        const { machineID, ...updateData } = req.query;

        if (!machineID) {
            return res.status(400).json({ message: 'machineID is required' });
        }

        const [updated] = await MachineData.update(updateData, {
            where: { machineID }
        });

        if (updated) {
            const updatedMachine = await MachineData.findOne({ where: { machineID } });
            return res.status(200).json({ message: 'Machine data updated.', payload: { updatedMachine } });
        }

        const newMachineData = await MachineData.create({
            machineID,
            ...updateData
        });

        res.status(201).json({ message: 'Machine data created.', payload: { newMachineData } });
    } catch (error) {
        console.error('Error updating machine data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};