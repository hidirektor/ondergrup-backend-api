const Machine = require('../../models/Machine');

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