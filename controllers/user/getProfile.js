const Users = require('../../models/User');
const UserPreferences = require('../../models/UserPreferences');

/**
 * @swagger
 * /getProfile:
 *   post:
 *     summary: Retrieve user details and preferences
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
 *                 description: User ID of the user and preferences to retrieve
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: User details and preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 userPreferences:
 *                   $ref: '#/components/schemas/UserPreferences'
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
    const { userID } = req.body;

    const user = await Users.findOne({ where: { userID } });
    const userPreferences = await UserPreferences.findOne({ where: { userID } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user, userPreferences });
};