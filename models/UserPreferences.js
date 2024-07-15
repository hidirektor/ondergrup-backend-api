const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreferences:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user preferences entry.
 *           example: 1
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *           example: "USR123456"
 *         language:
 *           type: boolean
 *           description: Language preference of the user.
 *           example: true
 *         nightMode:
 *           type: boolean
 *           description: Whether night mode is enabled.
 *           example: false
 */

const UserPreferences = sequelize.define('UserPreferences', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, index: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false },
    language: { type: DataTypes.BOOLEAN, defaultValue: true },
    nightMode: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: false,
    tableName: 'UserPreferences',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = UserPreferences;