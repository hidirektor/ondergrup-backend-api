const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     OTPLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the OTP log entry.
 *           example: 1
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *           example: "USR123456"
 *         otpType:
 *           type: string
 *           description: Type of OTP (e.g., email, SMS).
 *           example: "SMS"
 *         otpCode:
 *           type: string
 *           description: OTP code sent to the user.
 *           example: "123456"
 *         otpSentTime:
 *           type: integer
 *           description: Timestamp of when the OTP was sent.
 *           example: 1628000000
 *         otpValidationTime:
 *           type: integer
 *           description: Timestamp of when the OTP was validated.
 *           example: 1628003600
 */

const OTPLog = sequelize.define('OTPLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: true },
    otpType: { type: DataTypes.STRING, allowNull: true },
    otpCode: { type: DataTypes.STRING, allowNull: true },
    otpSentTime: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
    otpValidationTime: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    }

}, {
    timestamps: false,
    tableName: 'OTPLog',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = OTPLog;