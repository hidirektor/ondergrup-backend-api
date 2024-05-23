const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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