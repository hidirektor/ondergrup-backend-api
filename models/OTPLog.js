const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     OTPLog:
 *       type: object
 *       required:
 *          - userID
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the OTP log entry.
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *         otpType:
 *           type: string
 *           description: Type of OTP (e.g., email, SMS).
 *         otpCode:
 *           type: string
 *           description: OTP code sent to the user.
 *         otpSentTime:
 *           type: integer
 *           description: Timestamp of when the OTP was sent.
 *         otpValidationTime:
 *           type: integer
 *           description: Timestamp of when the OTP was validated.
 *       example:
 *          userID: "12345"
 *          otpType: "SMS"
 *          otpCode: "123123"
 *          otpSentTime: 1628000000
 *          otpValidationTime: 1628000000
 */

const OTPLog = sequelize.define('OTPLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userID: { type: DataTypes.STRING, allowNull: false },
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