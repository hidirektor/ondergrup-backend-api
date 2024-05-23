const Maintenance = require('../../../models/Maintenance');

module.exports = async (req, res) => {
    try {
        const { maintenanceID, ...updateData } = req.body;

        if (!maintenanceID) {
            return res.status(400).json({ message: 'maintenanceID is required' });
        }

        const [updated] = await Maintenance.update(updateData, {
            where: { maintenanceID }
        });

        if (updated) {
            const updatedMaintenance = await Maintenance.findOne({ where: { maintenanceID } });
            return res.status(200).json({ message: 'Maintenance record updated', updatedMaintenance });
        }

        throw new Error('Maintenance record not found');
    } catch (error) {
        console.error('Error updating maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};