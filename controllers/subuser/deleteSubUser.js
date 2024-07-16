const SubUser = require('../../models/SubUser');
const User = require('../../models/User');

/**
 * @swagger
 * /deleteSubUser:
 *   delete:
 *     summary: Delete a subuser and associated user by ID
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
 *         description: SubUser and associated User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubUser and associated User deleted successfully"
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
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        const subUser = await SubUser.findOne({ where: { id } });
        if (!subUser) {
            return res.status(404).json({ message: 'SubUser not found' });
        }

        const user = await User.findOne({ where: { userID: subUser.userID } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await subUser.destroy();
        await user.destroy();

        res.status(200).json({ message: 'SubUser and associated User deleted successfully' });
    } catch (error) {
        console.error('Error deleting SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
