const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Machine:
 *       type: object
 *       required:
 *          - machineID
 *          - machineType
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the machine.
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine assigned by the system.
 *         ownerID:
 *           type: string
 *           description: Unique identifier for the owner of the machine.
 *         machineType:
 *           type: string
 *           description: Type or model of the machine.
 *         createdAt:
 *           type: integer
 *           description: Timestamp of when the machine was created.
 *         lastUpdate:
 *           type: integer
 *           description: Timestamp of the last update to the machine's record.
 *       example:
 *          machineID: "12345"
 *          ownerID: "12312312"
 *          createdAt: 1622547802
 *          lastUpdate: 1622547802
 */

const Machine = sequelize.define('Machine', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    machineID: { type: DataTypes.STRING, unique: true, allowNull: false },
    ownerID: { type: DataTypes.STRING, allowNull: true },
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
    collate: 'utf8_general_ci',
    indexes: [
        {
            unique: true,
            fields: ['machineID'],
        },
    ],
});

module.exports = Machine;