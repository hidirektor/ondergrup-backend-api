const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshToken:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The refresh token.
 *           example: "a1b2c3d4e5f6g7h8i9j0"
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *           example: "USR123456"
 */

const RefreshToken = sequelize.define('RefreshToken', {
    token: { type: DataTypes.STRING, primaryKey: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
    timestamps: false,
    tableName: 'RefreshTokens',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = RefreshToken;