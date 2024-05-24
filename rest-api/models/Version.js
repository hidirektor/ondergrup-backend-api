const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Version = sequelize.define('Version', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    versionCode: { type: DataTypes.STRING, unique: true, allowNull: false },
    versionTitle: { type: DataTypes.STRING, allowNull: false },
    versionDesc: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
    versionDate: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'Versions',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = Version;