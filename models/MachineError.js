const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     MachineError:
 *       type: object
 *       required:
 *          - machineID
 *          - errorCode
 *          - errorMessage
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the machine error entry.
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine.
 *         errorCode:
 *           type: string
 *           description: Code representing the specific error.
 *         errorMessage:
 *           type: string
 *           description: Description of the error.
 *         errorTime:
 *           type: integer
 *           description: Timestamp of when the error occurred.
 *           example: 1628000000
 *       example:
 *          machineID: "12345"
 *          errorCode: "2"
 *          errorMessage: "Basınç Hatası"
 *          errorTime: 1622547802
 */

const MachineError = sequelize.define('MachineError', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    machineID: { type: DataTypes.STRING, unique: true, allowNull: false },
    errorCode: { type: DataTypes.STRING, allowNull: false },
    errorMessage: { type: DataTypes.STRING, allowNull: false },
    errorTime: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'MachineErrors',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = MachineError;