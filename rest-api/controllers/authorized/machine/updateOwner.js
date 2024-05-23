const Users = require('../../../models/User');
const Machine = require("../../../models/Machine");

module.exports = async (req, res) => {
    const { machineID, userName } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userID = user.userID;

    const machine = await Machine.findOne({ where: { machineID }});
    if(!machine) return res.status(404).json({ message: 'Machine not found' });

    machine.ownerID = userID;
    await machine.save();

    res.json({ message: 'Machine owner updated successfully' });
};