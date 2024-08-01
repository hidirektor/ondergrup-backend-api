const UserPreferences = require('../../models/UserPreferences');

/**
 * @swagger
 * /getPreferences:
 *   post:
 *     summary: Retrieve user preferences
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
 *                 description: User ID of the preferences to retrieve
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: string
 *                  example: 'Successfully retrieved user preferences.'
 *                 payload:
 *                  type: object
 *                  properties:
 *                    userPreferences:
 *                      $ref: '#/components/schemas/UserPreferences'
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
    const { userID } = req.body;

    const userPreferences = await UserPreferences.findOne({ where: { userID } });

    if (!userPreferences) return res.status(404).json({ message: 'Preferences not found' });

    res.status(200).json({ message: 'Successfully retrieved user preferences.', payload: { userPreferences } });
};