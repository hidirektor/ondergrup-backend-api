const Users = require('../../../models/User');

/**
 * @swagger
 * /updateRole:
 *   put:
 *     summary: Update user role
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - newRole
 *             properties:
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
    const { userName, newRole } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.userType = newRole;
    await user.save();

    res.json({ message: 'User role updated successfully' });
};