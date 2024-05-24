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
            maintenanceDate: Math.floor(Date.now() / 1000),
            ...updateData
        });

        res.status(201).json({ message: 'Maintenance record created successfully', maintenance });
    } catch (error) {
        console.error('Error creating maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};