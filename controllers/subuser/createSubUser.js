const SubUser = require('../../models/SubUser');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const generateUserID = require("../../helpers/userIDGenerator");
const Users = require("../../models/User");

const Sequelize = require('sequelize');

/**
 * @swagger
 * /createSubUser:
 *   post:
 *     summary: Create a new subuser under an existing owner
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
 *               userID:
 *                 type: string
 *                 description: The ID of the new subuser
 *                 example: "subuser123"
 *               userName:
 *                 type: string
 *                 description: The username of the new subuser
 *                 example: "subuser_username"
 *               userType:
 *                 type: string
 *                 description: The type of the new subuser
 *                 example: "employee"
 *               nameSurname:
 *                 type: string
 *                 description: The full name of the new subuser
 *                 example: "John Doe"
 *               eMail:
 *                 type: string
 *                 description: The email address of the new subuser
 *                 example: "john.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the new subuser
 *                 example: "+1234567890"
 *               companyName:
 *                 type: string
 *                 description: The company name associated with the new subuser
 *                 example: "Acme Corporation"
 *               password:
 *                 type: string
 *                 description: The password for the new subuser
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: SubUser created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubUser created successfully."
 *                 payload:
 *                   type: object
 *                   properties:
 *                     subUser:
 *                       $ref: '#/components/schemas/SubUser'
 *                     newUser:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Owner not found"
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
        const { ownerID, userName, userType, nameSurname, eMail, phoneNumber, companyName, password } = req.body;

        if (!ownerID || !userName || !userType || !nameSurname || !eMail || !phoneNumber || !companyName || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const owner = await User.findOne({ where: { userID: ownerID } });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        let userID = generateUserID();
        let userIDExists = await Users.findOne({ where: { userID } });

        while (userIDExists) {
            userID = generateUserID();
            userIDExists = await Users.findOne({ where: { userID } });
        }

        const existingUser = await User.findOne({ where: { [Sequelize.Op.or]: [{ userID }, { userName }, { eMail }] } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this userID, userName, or eMail already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userID,
            userName,
            userType,
            nameSurname,
            eMail,
            phoneNumber,
            companyName,
            password: hashedPassword
        });

        const subUser = await SubUser.create({
            ownerID,
            userID,
        });

        res.status(201).json({ message: 'SubUser created successfully.', payload: { subUser, newUser } });
    } catch (error) {
        console.error('Error creating SubUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
