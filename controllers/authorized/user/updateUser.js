const Users = require('../../../models/User');
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * /updateUser:
 *   post:
 *     summary: Update user profile
 *     tags: [Authorized]
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
    const { sourceUserID, userID, userData } = req.body;

    const user = await Users.findOne({ where: { userID } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
    }

    await user.update(userData);

    res.json({ message: 'Profile updated successfully' });
};