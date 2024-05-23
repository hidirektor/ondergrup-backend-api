const Machine = require('../../models/Machine');

module.exports = async (req, res) => {
    try {
        const { ownerID } = req.body;

        if (!ownerID) {
            return res.status(400).json({ message: 'ownerID is required' });
        }

        const machines = await Machine.findAll({ where: { ownerID } });

        if (!machines.length) {
            return res.status(404).json({ message: 'No machines found for this user' });
        }

        res.status(200).json({ machines });
    } catch (error) {
        console.error('Error retrieving machines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};