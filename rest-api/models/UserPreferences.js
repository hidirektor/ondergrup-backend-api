const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreferences = sequelize.define('UserPreferences', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, index: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false },
    language: { type: DataTypes.BOOLEAN, defaultValue: true },
    nightMode: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: false,
    tableName: 'UserPreferences',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = UserPreferences;