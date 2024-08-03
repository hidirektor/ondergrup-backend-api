const Users = require('../../../models/User');

/**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: Get all active users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of active users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all users.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       404:
 *         description: No active users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No active users found in the database.
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
    try {
        const users = await Users.findAll();
        if (!users.length) {
            return res.status(404).json({ message: 'No users found in the database.' });
        }

        res.status(200).json({ message: 'Successfully retrieved all users.', payload: { users } });
    } catch (error) {
        console.log('Error retrieving all users', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};