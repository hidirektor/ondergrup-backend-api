const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, index: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false },
    userName: { type: DataTypes.STRING, unique: true, allowNull: false },
    userType: { type: DataTypes.STRING, allowNull: false },
    nameSurname: { type: DataTypes.STRING, allowNull: false },
    eMail: { type: DataTypes.STRING, unique: true, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.BIGINT, defaultValue: Date.now() / 1000}
}, {
    timestamps: false,
    tableName: 'Users',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = User;