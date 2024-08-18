const UserPreferences = require('../../models/UserPreferences');

/**
 * @swagger
 * /updatePreferences:
 *   post:
 *     summary: Update user preferences
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
 *                 description: User ID of the user whose preferences to update
 *                 example: "123456789"
 *               preferencesData:
 *                 type: object
 *                 description: Updated preferences data to be applied
 *                 example:
 *                   theme: "dark"
 *                   notifications: true
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preferences updated successfully"
 *       404:
 *         description: Preferences not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preferences not found"
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
    const { userID, preferencesData } = req.body;

    const userPreferences = await UserPreferences.findOne({ where: { userID } });
    if (!userPreferences) return res.status(404).json({ message: 'Preferences not found' });

    await userPreferences.update(preferencesData);

    res.json({ message: 'Preferences updated successfully' });
};