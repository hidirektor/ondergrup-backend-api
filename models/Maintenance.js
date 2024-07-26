const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Maintenance:
 *       type: object
 *       required:
 *          - machineID
 *          - technicianID
 *          - kontrol11
 *          - kontrol12
 *          - kontrol13
 *          - kontrol14
 *          - kontrol21
 *          - kontrol22
 *          - kontrol23
 *          - kontrol24
 *          - kontrol31
 *          - kontrol32
 *          - kontrol33
 *          - kontrol34
 *          - kontrol35
 *          - kontrol36
 *          - kontrol41
 *          - kontrol42
 *          - kontrol43
 *          - kontrol44
 *          - kontrol45
 *          - kontrol46
 *          - kontrol51
 *          - kontrol52
 *          - kontrol53
 *          - kontrol54
 *          - kontrol55
 *          - kontrol56
 *          - kontrol61
 *          - kontrol62
 *          - kontrol63
 *          - kontrol71
 *          - kontrol72
 *          - kontrol81
 *          - kontrol82
 *          - kontrol83
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the maintenance entry.
 *           example: 1
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine.
 *           example: "MCH123456"
 *         technicianID:
 *           type: string
 *           description: Unique identifier for the technician.
 *           example: "TECH987654"
 *         maintenanceDate:
 *           type: integer
 *           description: Timestamp of when the maintenance was performed.
 *           example: 1628000000
 *         kontrol11:
 *           type: integer
 *           description: Status of kontrol 11.
 *           example: 1
 *         kontrol12:
 *           type: integer
 *           description: Status of kontrol 12.
 *           example: 1
 *         kontrol13:
 *           type: integer
 *           description: Status of kontrol 13.
 *           example: 1
 *         kontrol14:
 *           type: integer
 *           description: Status of kontrol 14.
 *           example: 1
 *         kontrol21:
 *           type: integer
 *           description: Status of kontrol 21.
 *           example: 1
 *         kontrol22:
 *           type: integer
 *           description: Status of kontrol 22.
 *           example: 1
 *         kontrol23:
 *           type: integer
 *           description: Status of kontrol 23.
 *           example: 1
 *         kontrol24:
 *           type: integer
 *           description: Status of kontrol 24.
 *           example: 1
 *         kontrol31:
 *           type: integer
 *           description: Status of kontrol 31.
 *           example: 1
 *         kontrol32:
 *           type: integer
 *           description: Status of kontrol 32.
 *           example: 1
 *         kontrol33:
 *           type: integer
 *           description: Status of kontrol 33.
 *           example: 1
 *         kontrol34:
 *           type: integer
 *           description: Status of kontrol 34.
 *           example: 1
 *         kontrol35:
 *           type: integer
 *           description: Status of kontrol 35.
 *           example: 1
 *         kontrol36:
 *           type: integer
 *           description: Status of kontrol 36.
 *           example: 1
 *         kontrol41:
 *           type: integer
 *           description: Status of kontrol 41.
 *           example: 1
 *         kontrol42:
 *           type: integer
 *           description: Status of kontrol 42.
 *           example: 1
 *         kontrol43:
 *           type: integer
 *           description: Status of kontrol 43.
 *           example: 1
 *         kontrol44:
 *           type: integer
 *           description: Status of kontrol 44.
 *           example: 1
 *         kontrol45:
 *           type: integer
 *           description: Status of kontrol 45.
 *           example: 1
 *         kontrol46:
 *           type: integer
 *           description: Status of kontrol 46.
 *           example: 1
 *         kontrol51:
 *           type: integer
 *           description: Status of kontrol 51.
 *           example: 1
 *         kontrol52:
 *           type: integer
 *           description: Status of kontrol 52.
 *           example: 1
 *         kontrol53:
 *           type: integer
 *           description: Status of kontrol 53.
 *           example: 1
 *         kontrol54:
 *           type: integer
 *           description: Status of kontrol 54.
 *           example: 1
 *         kontrol55:
 *           type: integer
 *           description: Status of kontrol 55.
 *           example: 1
 *         kontrol56:
 *           type: integer
 *           description: Status of kontrol 56.
 *           example: 1
 *         kontrol61:
 *           type: integer
 *           description: Status of kontrol 61.
 *           example: 1
 *         kontrol62:
 *           type: integer
 *           description: Status of kontrol 62.
 *           example: 1
 *         kontrol63:
 *           type: integer
 *           description: Status of kontrol 63.
 *           example: 1
 *         kontrol71:
 *           type: integer
 *           description: Status of kontrol 71.
 *           example: 1
 *         kontrol72:
 *           type: integer
 *           description: Status of kontrol 72.
 *           example: 1
 *         kontrol81:
 *           type: integer
 *           description: Status of kontrol 81.
 *           example: 1
 *         kontrol82:
 *           type: integer
 *           description: Status of kontrol 82.
 *           example: 1
 *         kontrol83:
 *           type: integer
 *           description: Status of kontrol 83.
 *           example: 1
 *         kontrol91:
 *           type: integer
 *           description: Status of kontrol 91.
 *           example: 1
 *         kontrol92:
 *           type: integer
 *           description: Status of kontrol 92.
 *           example: 1
 *         kontrol93:
 *           type: integer
 *           description: Status of kontrol 93.
 *           example: 1
 *         kontrol94:
 *           type: integer
 *           description: Status of kontrol 94.
 *           example: 1
 *         kontrol95:
 *           type: integer
 *           description: Status of kontrol 95.
 *           example: 1
 *         kontrol96:
 *           type: integer
 *           description: Status of kontrol 96.
 *           example: 1
 *         kontrol97:
 *           type: integer
 *           description: Status of kontrol 97.
 *           example: 1
 *         kontrol98:
 *           type: integer
 *           description: Status of kontrol 98.
 *           example: 1
 *         kontrol99:
 *           type: integer
 *           description: Status of kontrol 99.
 *           example: 1
 *         kontrol910:
 *           type: integer
 *           description: Status of kontrol 910.
 *           example: 1
 *       example:
 *          machineID: "12345"
 *          technicianID: "12345"
 *          kontrol11: 1
 *          kontrol12: 0
 *          kontrol13: 1
 *          kontrol14: 1
 *          kontrol21: 1
 *          kontrol22: 1
 *          kontrol23: 1
 *          kontrol24: 1
 *          kontrol31: 0
 *          kontrol32: 1
 *          kontrol33: 1
 *          kontrol34: 0
 *          kontrol35: 1
 *          kontrol36: 1
 *          kontrol41: 0
 *          kontrol42: 1
 *          kontrol43: 1
 *          kontrol44: 0
 *          kontrol45: 1
 *          kontrol46: 1
 *          kontrol51: 0
 *          kontrol52: 0
 *          kontrol53: 1
 *          kontrol54: 1
 *          kontrol55: 0
 *          kontrol56: 1
 *          kontrol61: 1
 *          kontrol62: 0
 *          kontrol63: 1
 *          kontrol71: 0
 *          kontrol72: 1
 *          kontrol81: 1
 *          kontrol82: 1
 *          kontrol83: 1
 *          kontrol91: "Kontrol durumu belirtilecek."
 *          kontrol92: "Kontrol durumu belirtilecek."
 *          kontrol93: "Kontrol durumu belirtilecek."
 *          kontrol94: "Kontrol durumu belirtilecek."
 *          kontrol95: "Kontrol durumu belirtilecek."
 *          kontrol96: "Kontrol durumu belirtilecek."
 *          kontrol97: "Kontrol durumu belirtilecek."
 *          kontrol98: "Kontrol durumu belirtilecek."
 *          kontrol99: "Kontrol durumu belirtilecek."
 *          kontrol910: "Kontrol durumu belirtilecek."
 */

const Maintenance = sequelize.define('Maintenance', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    machineID: { type: DataTypes.STRING, unique: true, allowNull: false },
    technicianID: { type: DataTypes.STRING, unique: true, allowNull: false },
    maintenanceDate: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
    kontrol11: { type: DataTypes.INTEGER, allowNull: false },
    kontrol12: { type: DataTypes.INTEGER, allowNull: false },
    kontrol13: { type: DataTypes.INTEGER, allowNull: false },
    kontrol14: { type: DataTypes.INTEGER, allowNull: false },
    kontrol21: { type: DataTypes.INTEGER, allowNull: false },
    kontrol22: { type: DataTypes.INTEGER, allowNull: false },
    kontrol23: { type: DataTypes.INTEGER, allowNull: false },
    kontrol24: { type: DataTypes.INTEGER, allowNull: false },
    kontrol31: { type: DataTypes.INTEGER, allowNull: false },
    kontrol32: { type: DataTypes.INTEGER, allowNull: false },
    kontrol33: { type: DataTypes.INTEGER, allowNull: false },
    kontrol34: { type: DataTypes.INTEGER, allowNull: false },
    kontrol35: { type: DataTypes.INTEGER, allowNull: false },
    kontrol36: { type: DataTypes.INTEGER, allowNull: false },
    kontrol41: { type: DataTypes.INTEGER, allowNull: false },
    kontrol42: { type: DataTypes.INTEGER, allowNull: false },
    kontrol43: { type: DataTypes.INTEGER, allowNull: false },
    kontrol44: { type: DataTypes.INTEGER, allowNull: false },
    kontrol45: { type: DataTypes.INTEGER, allowNull: false },
    kontrol46: { type: DataTypes.INTEGER, allowNull: false },
    kontrol51: { type: DataTypes.INTEGER, allowNull: false },
    kontrol52: { type: DataTypes.INTEGER, allowNull: false },
    kontrol53: { type: DataTypes.INTEGER, allowNull: false },
    kontrol54: { type: DataTypes.INTEGER, allowNull: false },
    kontrol55: { type: DataTypes.INTEGER, allowNull: false },
    kontrol56: { type: DataTypes.INTEGER, allowNull: false },
    kontrol61: { type: DataTypes.INTEGER, allowNull: false },
    kontrol62: { type: DataTypes.INTEGER, allowNull: false },
    kontrol63: { type: DataTypes.INTEGER, allowNull: false },
    kontrol71: { type: DataTypes.INTEGER, allowNull: false },
    kontrol72: { type: DataTypes.INTEGER, allowNull: false },
    kontrol81: { type: DataTypes.INTEGER, allowNull: false },
    kontrol82: { type: DataTypes.INTEGER, allowNull: false },
    kontrol83: { type: DataTypes.INTEGER, allowNull: false },
    kontrol91: { type: DataTypes.STRING, allowNull: true },
    kontrol92: { type: DataTypes.STRING, allowNull: true },
    kontrol93: { type: DataTypes.STRING, allowNull: true },
    kontrol94: { type: DataTypes.STRING, allowNull: true },
    kontrol95: { type: DataTypes.STRING, allowNull: true },
    kontrol96: { type: DataTypes.STRING, allowNull: true },
    kontrol97: { type: DataTypes.STRING, allowNull: true },
    kontrol98: { type: DataTypes.STRING, allowNull: true },
    kontrol99: { type: DataTypes.STRING, allowNull: true },
    kontrol910: { type: DataTypes.STRING, allowNull: true }

}, {
    timestamps: false,
    tableName: 'Maintenances',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = Maintenance;