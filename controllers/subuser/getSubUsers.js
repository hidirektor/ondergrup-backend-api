const SubUser = require('../../models/SubUser');
const User = require('../../models/User');

/**
 * @swagger
 * /getSubUsers:
 *   get:
 *     summary: Retrieve sub-users and their associated users by ownerID
 *     tags: [Sub User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerID:
 *                 type: string
 *                 description: The ID of the owner user
 *                 example: "owner123"
 *     responses:
 *       200:
 *         description: Successfully retrieved sub-users and associated users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all sub users.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     subUsers:
 *                       type: array
 *                       description: Array of sub-user objects
 *                       items:
 *                         $ref: '#/components/schemas/SubUser'
 *                     users:
 *                       type: array
 *                       description: Array of user objects
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ownerID is required"
 *       404:
 *         description: No sub-users found for this owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No sub-users found for this owner"
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
    try {
        const { ownerID } = req.body;

        if (!ownerID) {
            return res.status(400).json({ message: 'ownerID is required' });
        }

        const subUsers = await SubUser.findAll({ where: { ownerID } });

        if (!subUsers.length) {
            return res.status(404).json({ message: 'No sub-users found for this owner' });
        }

        const userIDs = subUsers.map(subUser => subUser.userID);
        const users = await User.findAll({ where: { userID: userIDs } });

        res.status(200).json({ message: 'Successfully retrieved all sub users.', payload: { subUsers, users } });
    } catch (error) {
        console.error('Error retrieving sub-users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
