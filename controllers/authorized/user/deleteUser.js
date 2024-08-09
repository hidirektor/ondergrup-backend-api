const Users = require('../../../models/User');
const {createActionLog} = require("../../../helpers/logger/actionLog");

/**
 * @swagger
 * /deleteUser:
 *   post:
 *     summary: Delete a user by username
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
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID of source user.
 *               userName:
 *                 type: string
 *                 description: Username of the user to delete
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
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
 */

module.exports = async (req, res) => {
    const { userID, userName } = req.body;

    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();

        try {
            await createActionLog({
                sourceUserID: userID,
                affectedUserID: user.userID,
                affectedUserName: userName,
                affectedMachineID: null,
                affectedMaintenanceID: null,
                affectedHydraulicUnitID: null,
                operationSection: 'EMBEDDED',
                operationType: 'DELETE',
                operationName: 'User Deleted.',
            });
        } catch (error) {
            res.status(500).json({ message: 'Action Log can not created.' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
};