const SubUser = require('../../models/SubUser');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const ActionLog = require("../../models/ActionLog");

/**
 * @swagger
 * /editSubUser:
 *   put:
 *     summary: Update a subuser and associated user by ID
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
 *                 description: The ID of the subuser to update
 *                 example: "subuser123"
 *               ownerID:
 *                 type: string
 *                 description: The ID of the owner user
 *                 example: "owner123"
 *               userID:
 *                 type: string
 *                 description: The ID of the subuser user
 *                 example: "user456"
 *               userName:
 *                 type: string
 *                 description: The username of the subuser
 *                 example: "subuser"
 *               userType:
 *                 type: string
 *                 description: The type of the subuser
 *                 example: "subuser"
 *               nameSurname:
 *                 type: string
 *                 description: The full name of the subuser
 *                 example: "John Doe"
 *               eMail:
 *                 type: string
 *                 description: The email address of the subuser
 *                 example: "subuser@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the subuser
 *                 example: "+1234567890"
 *               companyName:
 *                 type: string
 *                 description: The company name of the subuser
 *                 example: "SubUser Inc."
 *               password:
 *                 type: string
 *                 description: The new password for the subuser (optional)
 *                 example: "newpassword"
 *     responses:
 *       200:
 *         description: SubUser and associated User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubUser updated successfully."
 *                 payload:
 *                   type: object
 *                   properties:
 *                     subUser:
 *                       $ref: '#/components/schemas/SubUser'
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields except password are required"
 *       404:
 *         description: SubUser, Owner, or User not found
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
        const { ownerID, userID, userName, userType, nameSurname, eMail, phoneNumber, companyName, password } = req.body;

        if (!ownerID || !userID || !userName || !userType || !nameSurname || !eMail || !phoneNumber || !companyName) {
            return res.status(400).json({ message: 'All fields except password are required' });
        }

        const subUser = await SubUser.findOne({ where: { userID: userID } });
        if (!subUser) {
            return res.status(404).json({ message: 'SubUser not found' });
        }

        const owner = await User.findOne({ where: { userID: ownerID } });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        const user = await User.findOne({ where: { userID } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.userName = userName;
        user.userType = userType;
        user.nameSurname = nameSurname;
        user.eMail = eMail;
        user.phoneNumber = phoneNumber;
        user.companyName = companyName;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        subUser.ownerID = ownerID;
        subUser.userID = userID;

        await subUser.save();

        await ActionLog.create({
            userID: ownerID,
            userName: owner.userName,
            operationType: "SUB USER",
            operationName: "Edit Sub User",
            operationTime: Math.floor(Date.now() / 1000)
        });

        res.status(200).json({ message: 'SubUser updated successfully.', payload: { subUser, user } });
    } catch (error) {
        console.error('Error updating SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
