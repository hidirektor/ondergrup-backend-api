const Users = require('../../../models/User');
const Machine = require("../../../models/Machine");

/**
 * @swagger
 * /updateOwner:
 *   put:
 *     summary: Update the owner of a machine
 *     tags: [Machine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machineID
 *               - userName
 *             properties:
 *               machineID:
 *                 type: integer
 *                 description: ID of the machine to update
 *                 example: 1
 *               userName:
 *                 type: string
 *                 description: Username of the new owner
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: Machine owner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Machine owner updated successfully
 *       404:
 *         description: User or machine not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

module.exports = async (req, res) => {
    const { machineID, userName } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userID = user.userID;

    const machine = await Machine.findOne({ where: { machineID } });
    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    machine.ownerID = userID;
    await machine.save();

    res.json({ message: 'Machine owner updated successfully' });
};