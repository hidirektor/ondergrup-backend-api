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
 *                 subUsers:
 *                   type: array
 *                   description: Array of sub-user objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "subuser123"
 *                       ownerID:
 *                         type: string
 *                         example: "owner123"
 *                       userID:
 *                         type: string
 *                         example: "user456"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-16T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-16T12:00:00Z"
 *                 users:
 *                   type: array
 *                   description: Array of associated User objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       userID:
 *                         type: string
 *                         example: "user456"
 *                       userName:
 *                         type: string
 *                         example: "username"
 *                       userType:
 *                         type: string
 *                         example: "user"
 *                       nameSurname:
 *                         type: string
 *                         example: "John Doe"
 *                       eMail:
 *                         type: string
 *                         example: "user@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+1234567890"
 *                       companyName:
 *                         type: string
 *                         example: "User Inc."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-16T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-16T12:00:00Z"
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

        res.status(200).json({ subUsers, users });
    } catch (error) {
        console.error('Error retrieving sub-users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
