const Users = require('../../../models/User');
const UserPreferences = require('../../../models/UserPreferences');
const bcrypt = require('bcryptjs');
const generateUserID = require('../../../helpers/userIDGenerator');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Register a new user
 *     tags: [Authorized]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - userType
 *               - nameSurname
 *               - eMail
 *               - phoneNumber
 *               - companyName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user
 *               userType:
 *                 type: string
 *                 description: The type of user (e.g., SysOp, Merchant, Carrier, Customer)
 *               nameSurname:
 *                 type: string
 *                 description: The name and surname of the user
 *               eMail:
 *                 type: string
 *                 description: The email address of the user
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user
 *               companyName:
 *                 type: string
 *                 description: The company name of the user
 *               password:
 *                 type: string
 *                 description: The password for the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully registered :)'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     newUser:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or unique constraint error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     uniqueError:
 *                       summary: Unique constraint error
 *                       value: Username is already taken
 *                     validationError:
 *                       summary: Validation error
 *                       value: Validation error message
 *       500:
 *         description: An unexpected error occurred while registering user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred while registering user
 */

module.exports = async (req, res) => {
    const {
        userName, userType, nameSurname, eMail, phoneNumber, companyName, password
    } = req.body;

    try {
        let generatedUserID = generateUserID();
        let userExists = await Users.findOne({ where: { userID: generatedUserID } });

        while (userExists) {
            generatedUserID = generateUserID();
            userExists = await Users.findOne({ where: { userID: generatedUserID } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            userID: generatedUserID, userName, userType, nameSurname, eMail, phoneNumber, companyName, password: hashedPassword
        });

        await UserPreferences.create({
            userID: generatedUserID,
            language: true,
            nightMode: false
        });

        res.status(200).json({message: 'Successfully registered :)', payload: { newUser }});
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            const message = field === 'userName' ? 'Username is already taken' : field === 'eMail' ? 'Email is already registered' : 'Unique constraint error';
            res.status(400).json({ message });
        } else if (error.name === 'SequelizeValidationError') {
            const message = error.errors.map(e => e.message).join(', ');
            res.status(400).json({ message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred while registering user' });
        }
    }
};