const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    kontrol91: { type: DataTypes.INTEGER, allowNull: true },
    kontrol92: { type: DataTypes.INTEGER, allowNull: true },
    kontrol93: { type: DataTypes.INTEGER, allowNull: true },
    kontrol94: { type: DataTypes.INTEGER, allowNull: true },
    kontrol95: { type: DataTypes.INTEGER, allowNull: true },
    kontrol96: { type: DataTypes.INTEGER, allowNull: true },
    kontrol97: { type: DataTypes.INTEGER, allowNull: true },
    kontrol98: { type: DataTypes.INTEGER, allowNull: true },
    kontrol99: { type: DataTypes.INTEGER, allowNull: true },
    kontrol910: { type: DataTypes.INTEGER, allowNull: true }

}, {
    timestamps: false,
    tableName: 'Maintenances',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = Maintenance;