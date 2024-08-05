const SubUser = require('../../models/SubUser');
const User = require('../../models/User');
const ActionLog = require("../../models/ActionLog");

/**
 * @swagger
 * /activateSubUser:
 *   post:
 *     summary: Activate a subuser and associated user by ID
 *     tags: [Sub User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the subuser to delete
 *                 example: "subuser123"
 *     responses:
 *       200:
 *         description: SubUser activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubUser activated successfully"
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "id is required"
 *       404:
 *         description: SubUser or User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubUser not found"
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
        const { subUserID } = req.body;

        if (!subUserID) {
            return res.status(400).json({ message: 'subUserID is required' });
        }

        const subUser = await SubUser.findOne({ where: { userID: subUserID } });
        if (!subUser) {
            return res.status(404).json({ message: 'SubUser not found' });
        }

        const user = await User.findOne({ where: { userID: subUser.userID } });
        const userID = user.userID;
        const userName = user.userName;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = true;
        user.save();

        res.status(200).json({ message: 'SubUser activated successfully' });
    } catch (error) {
        console.error('Error activating SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
