const Maintenance = require('../../../models/Maintenance');

module.exports = async (req, res) => {
    try {
        const { machineID, technicianID, ...updateData } = req.body;

        if (!machineID || !technicianID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const maintenance = await Maintenance.create({
            machineID,
            technicianID,
            maintenanceDate: Math.floor(Date.now() / 1000)
        });

        res.status(201).json({ message: 'Machine added successfully', machine });
    } catch (error) {
        console.error('Error adding machine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
