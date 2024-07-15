const MachineData = require('../../models/MachineData');

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
            return res.status(200).json({ message: 'Machine data updated', updatedMachine });
        }

        const newMachineData = await MachineData.create({
            machineID,
            ...updateData
        });

        res.status(201).json({ message: 'Machine data created', newMachineData });
    } catch (error) {
        console.error('Error updating machine data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};