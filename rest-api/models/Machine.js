const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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