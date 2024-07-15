const Maintenance = require('../../../models/Maintenance');

module.exports = async (req, res) => {
    try {
        const { maintenanceID } = req.body;

        if (!maintenanceID) {
            return res.status(400).json({ message: 'maintenanceID is required' });
        }

        const maintenance = await Maintenance.findOne({ where: { maintenanceID } });
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        await maintenance.destroy();

        res.json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
