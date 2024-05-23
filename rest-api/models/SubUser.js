const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubUser = sequelize.define('SubUser', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, index: true },
    ownerID: { type: DataTypes.STRING, unique: true, allowNull: false },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
    timestamps: false,
    tableName: 'SubUsers',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = SubUser;