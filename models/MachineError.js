const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     MachineError:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the machine error entry.
 *           example: 1
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine.
 *           example: "MCH123456"
 *         errorCode:
 *           type: string
 *           description: Code representing the specific error.
 *           example: "ERR001"
 *         errorMessage:
 *           type: string
 *           description: Description of the error.
 *           example: "Overheating detected"
 *         errorTime:
 *           type: integer
 *           description: Timestamp of when the error occurred.
 *           example: 1628000000
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