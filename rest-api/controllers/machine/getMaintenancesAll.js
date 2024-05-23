const Machine = require('../../models/Machine');
const MachineMaintenances = require('../../models/Maintenance');

module.exports = async (req, res) => {
    try {
        const { userID } = req.body;

        if(!userID) {
            return res.status(400).json({ message: 'userID is required' });
        }

        const machines = await Machine.findAll({ where: { userID } });
        if (!machines.length) {
            return res.status(404).json({ message: 'No machines found for this user' });
        }

        const machineIDs = machines.map(machine => machine.machineID);

        const maintenances = await MachineMaintenances.findAll({
            where: {
                machineID: machineIDs
            }
        });

        res.status(200).json({ maintenances });
    } catch (error) {
        console.log('Error retrieving all machine errors', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}