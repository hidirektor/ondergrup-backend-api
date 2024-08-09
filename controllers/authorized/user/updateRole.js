const Users = require('../../../models/User');
const {createActionLog} = require("../../../helpers/logger/actionLog");

/**
 * @swagger
 * /updateRole:
 *   put:
 *     summary: Update user role
 *     tags: [Authorized]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - userName
 *               - newRole
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID of source user.
 *               userName:
 *                 type: string
 *                 description: Username of the user
 *                 example: johndoe
 *               newRole:
 *                 type: string
 *                 description: New role to assign to the user
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User role updated successfully
 *       404:
 *         description: User not found
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
    const { userID, userName, newRole } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.userType = newRole;
    await user.save();

    try {
        await createActionLog({
            sourceUserID: userID,
            affectedUserID: user.userID,
            affectedUserName: userName,
            affectedMachineID: null,
            affectedMaintenanceID: null,
            affectedHydraulicUnitID: null,
            operationSection: 'EMBEDDED',
            operationType: 'UPDATE',
            operationName: 'User Role Updated.',
        });
    } catch (error) {
        res.status(500).json({ message: 'Action Log can not created.' });
    }

    res.json({ message: 'User role updated successfully' });
};