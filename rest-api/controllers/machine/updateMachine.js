const MachineData = require('../../models/MachineData');

const updateMachine = async (req, res) => {
    try {
        const { machineID, ...updateData } = req.body;

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

        throw new Error('Machine not found');
    } catch (error) {
        console.error('Error updating machine data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = updateMachine;
