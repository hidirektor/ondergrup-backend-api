const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Version:
 *       type: object
 *       required:
 *          - versionTitle
 *          - versionDesc
 *          - versionCode
 *          - versionPath
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the version entry.
 *         versionTitle:
 *           type: string
 *           description: Title of the version.
 *         versionDesc:
 *           type: string
 *           description: Description of the version.
 *         versionCode:
 *           type: string
 *           description: Unique code for the version.
 *         versionPath:
 *           type: string
 *           description: Bucket name for MinIO where the version is stored.
 *         releaseDate:
 *           type: integer
 *           description: Release date of the version in Unix timestamp format.
 *       example:
 *          versionTitle: "İlk Sürüm"
 *          versionDesc: "İlk sürüm yayınlandı !! :))"
 *          versionCode: "1.0.0"
 *          versionPath: "versions/asdasd123123123.hex"
 *          releaseDate: 1622548800
 */

const Version = sequelize.define('Version', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    versionTitle: { type: DataTypes.STRING, allowNull: false },
    versionDesc: { type: DataTypes.STRING, allowNull: false },
    versionCode: { type: DataTypes.STRING, allowNull: false },
    versionID: { type: DataTypes.STRING, allowNull: false },
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