const MachineError = require('../../models/MachineError');

module.exports = async (req, res) => {
    try {
        const { machineID } = req.body;

        if(!machineID) {
            return res.status(400).json({message: 'machineID is required'});
        }

        const machineErrors = await MachineError.findAll({ where: { machineID } });

        if(!machineErrors.length) {
            return res.status(404).json({ message: 'No machineErrors found for this machine' });
        }

        return res.status(200).json({ machineErrors });
    } catch (error) {
        console.error('Error retrieving machine errors', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}