const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Version:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the version entry.
 *           example: 1
 *         versionTitle:
 *           type: string
 *           description: Title of the version.
 *           example: "1.0.0"
 *         versionDesc:
 *           type: string
 *           description: Description of the version.
 *           example: "Initial release"
 *         versionCode:
 *           type: string
 *           description: Unique code for the version.
 *           example: "v100"
 *         versionPath:
 *           type: string
 *           description: Bucket name for MinIO where the version is stored.
 *           example: "versions/1.0.0"
 *         releaseDate:
 *           type: integer
 *           description: Release date of the version in Unix timestamp format.
 *           example: 1622548800
 */

const Version = sequelize.define('Version', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    versionTitle: { type: DataTypes.STRING, allowNull: false },
    versionDesc: { type: DataTypes.STRING, allowNull: false },
    versionCode: { type: DataTypes.STRING, unique: true, allowNull: false },
    versionPath: { type: DataTypes.STRING, allowNull: false }, //Bucket Name for MinIO
    releaseDate: {
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