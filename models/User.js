const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user.
 *           example: 1
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *           example: "USR123456"
 *         userName:
 *           type: string
 *           description: Unique username for the user.
 *           example: "johndoe"
 *         userType:
 *           type: string
 *           description: Type of the user.
 *           example: "admin"
 *         nameSurname:
 *           type: string
 *           description: Full name of the user.
 *           example: "John Doe"
 *         eMail:
 *           type: string
 *           description: Email address of the user.
 *           example: "johndoe@example.com"
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the user.
 *           example: "+1234567890"
 *         companyName:
 *           type: string
 *           description: Name of the company the user is associated with.
 *           example: "Example Corp"
 *         password:
 *           type: string
 *           description: Password of the user.
 *           example: "password123"
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active.
 *           example: true
 *         createdAt:
 *           type: integer
 *           description: Timestamp of when the user was created.
 *           example: 1628000000
 */

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, index: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false },
    userName: { type: DataTypes.STRING, unique: true, allowNull: false },
    userType: { type: DataTypes.STRING, allowNull: false },
    nameSurname: { type: DataTypes.STRING, allowNull: false },
    eMail: { type: DataTypes.STRING, unique: true, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.BIGINT, defaultValue: Date.now() / 1000}
}, {
    timestamps: false,
    tableName: 'Users',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = User;