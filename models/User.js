const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *          - userID
 *          - userName
 *          - userType
 *          - nameSurname
 *          - eMail
 *          - phoneNumber
 *          - companyName
 *          - password
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user.
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *         userName:
 *           type: string
 *           description: Unique username for the user.
 *         userType:
 *           type: string
 *           description: Type of the user.
 *         nameSurname:
 *           type: string
 *           description: Full name of the user.
 *         eMail:
 *           type: string
 *           description: Email address of the user.
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the user.
 *         companyName:
 *           type: string
 *           description: Name of the company the user is associated with.
 *         password:
 *           type: string
 *           description: Password of the user.
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active.
 *         createdAt:
 *           type: integer
 *           description: Timestamp of when the user was created.
 *       example:
 *          userID: "12345"
 *          userName: "hidirektor"
 *          userType: "ENGINEER"
 *          nameSurname: "Halil İbrahim DİREKTÖR"
 *          eMail: "hidirektor@gmail.com"
 *          phoneNumber: "5417410309"
 *          companyName: "Lebara Mobile UK"
 *          password: "asdasd"
 *          isActive: true
 *          createdAt: 1628000000
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