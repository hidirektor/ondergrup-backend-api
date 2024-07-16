const Users = require('../../../models/User');

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     summary: Deactivate a user by username
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Username of the user to deactivate
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deactivated successfully
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
    const { userName } = req.body;

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deleted successfully' });
};