const MachineMaintenance = require('../../models/Maintenance');

module.exports = async (req, res) => {
    try {
        const { machineID } = req.body;

        if(!machineID) {
            return res.status(400).json({message: 'machineID is required'});
        }

        const machineMaintenances = await MachineMaintenance.findAll({ where: { machineID } });

        if(!machineMaintenances.length) {
            return res.status(404).json({ message: 'No maintenances found for this machine' });
        }

        return res.status(200).json({ machineMaintenances });
    } catch (error) {
        console.error('Error retrieving machine maintenances', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}