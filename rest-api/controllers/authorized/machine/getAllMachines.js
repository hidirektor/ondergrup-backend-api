const Machine = require('../../../models/Machine');

module.exports = async (req, res) => {
    try {
        const machines = await Machine.findAll();
        if (!machines.length) {
            return res.status(404).json({ message: 'No any machines found on database.' });
        }

        res.status(200).json({ machines });
    } catch (error) {
        console.log('Error retrieving all machines', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};