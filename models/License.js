const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     License:
 *       type: object
 *       required:
 *          - licenseOwner
 *          - licenseEmail
 *          - licenseExpiry
 *          - licenseDeviceCount
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the OTP log entry.
 *         licenseID:
 *           type: string
 *           description: Unique ID for each license keys.
 *         licenseKey:
 *           type: string
 *           description: Unique license key
 *         licenseOwner:
 *           type: string
 *           description: License Owner
 *         licenseEmail:
 *           type: string
 *           description: License owner email
 *         licenseExpiry:
 *           type: string
 *           description: License expiry date.
 *         licenseDeviceCount:
 *           type: string
 *           description: Supported device count for single license
 *         operationTime:
 *           type: integer
 *           description: Timestamp of when the ActionLog was created.
 *       example:
 *         licenseKey: "124141231231"
 *         licenseOwner: "Halil İbrahim Direktör"
 *         licenseEmail: "hidirektor@gmail.com"
 *         licenseExpiry: "unlimited || timestamp value"
 *         licenseDeviceCount: "1"
 *         operationTime: 1628000000
 */

const License = sequelize.define('License', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    licenseID: { type: DataTypes.STRING, allowNull: false, unique: true },
    licenseKey: { type: DataTypes.STRING, allowNull: false },
    licenseOwner: { type: DataTypes.STRING, allowNull: false },
    licenseEmail: { type: DataTypes.STRING, allowNull: true },
    licenseExpiry: { type: DataTypes.STRING, allowNull: true },
    licenseDeviceCount: { type: DataTypes.STRING, allowNull: true },
    operationTime: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'License',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = License;