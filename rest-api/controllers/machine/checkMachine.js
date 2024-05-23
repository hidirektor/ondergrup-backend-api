const Machine = require('../../models/Machine');

module.exports = async (req, res) => {
    try {
        const { machineID } = req.body;

        if (!machineID) {
            return res.status(400).json({ message: 'machineID is required' });
        }

        const machine = await Machine.findOne({ where: { machineID } });

        if (machine) {
            return res.status(200).json({ exists: true, message: 'Machine exists' });
        } else {
            return res.status(404).json({ exists: false, message: 'Machine not found' });
        }
    } catch (error) {
        console.error('Error checking machine ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
