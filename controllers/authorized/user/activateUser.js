const Users = require('../../../models/User');

/**
 * @swagger
 * /activateUser:
 *   post:
 *     summary: Activate a user by username
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
 *                 description: User ID of source user
 *               userName:
 *                 type: string
 *                 description: Username of the user to activate
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: User activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User activated successfully
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

    const user = await Users.findOne({ where: { userName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = true;
    await user.save();

    res.json({ message: 'User activated successfully' });
};