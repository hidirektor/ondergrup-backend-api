const Users = require('../../models/User');
const bcrypt = require("bcryptjs");
const {createActionLog} = require("../../helpers/logger/actionLog");

/**
 * @swagger
 * /updateProfile:
 *   post:
 *     summary: Update user profile
 *     tags: [User Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID of the user whose profile to update
 *                 example: "123456789"
 *               userData:
 *                 type: object
 *                 description: Updated user profile data to be applied
 *                 example:
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "+1234567890"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

module.exports = async (req, res) => {
    const { userID, userData } = req.body;

    const user = await Users.findOne({ where: { userID } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
    }

    await user.update(userData);

    try {
        await createActionLog({
            sourceUserID: userID,
            affectedUserID: null,
            affectedUserName: null,
            affectedMachineID: null,
            affectedMaintenanceID: null,
            affectedHydraulicUnitID: null,
            operationSection: 'GENERAL',
            operationType: 'UPDATE',
            operationName: 'Profile Updated.',
        });
    } catch (error) {
        res.status(500).json({ message: 'Action Log can not created.' });
    }

    res.json({ message: 'Profile updated successfully' });
};