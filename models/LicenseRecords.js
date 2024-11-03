const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     LicenseRecords:
 *       type: object
 *       required:
 *          - licenseID
 *          - deviceInfo
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the OTP log entry.
 *         licenseID:
 *           type: string
 *           description: Unique ID for each license keys.
 *         activatedBy:
 *           type: string
 *           description: User that activate current license
 *         deviceInfo:
 *           type: string
 *           description: Device that activated license
 *         operationTime:
 *           type: integer
 *           description: Timestamp of when the activation was created.
 *       example:
 *         licenseID: "124141231231"
 *         deviceInfo: "device info json"
 */

const LicenseRecords = sequelize.define('LicenseRecords', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    licenseID: { type: DataTypes.STRING, allowNull: false },
    activatedBy: { type: DataTypes.STRING, allowNull: false },
    deviceInfo: { type: DataTypes.TEXT, allowNull: true },
    activationTime: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'LicenseRecords',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = LicenseRecords;