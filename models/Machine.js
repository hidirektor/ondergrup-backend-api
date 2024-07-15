const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Machine:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the machine.
 *           example: 1
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine assigned by the system.
 *           example: "MCH123456"
 *         ownerID:
 *           type: string
 *           description: Unique identifier for the owner of the machine.
 *           example: "OWN987654"
 *         machineType:
 *           type: string
 *           description: Type or model of the machine.
 *           example: "ESP"
 *         createdAt:
 *           type: integer
 *           description: Timestamp of when the machine was created.
 *           example: 1628000000
 *         lastUpdate:
 *           type: integer
 *           description: Timestamp of the last update to the machine's record.
 *           example: 1628000000
 */

const Machine = sequelize.define('Machine', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    machineID: { type: DataTypes.STRING, unique: true, allowNull: true },
    ownerID: { type: DataTypes.STRING, unique: true, allowNull: true },
    machineType: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
    lastUpdate: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    },

}, {
    timestamps: false,
    tableName: 'Machines',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = Machine;