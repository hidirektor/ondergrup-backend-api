const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfilePhoto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the profile photo.
 *         userName:
 *           type: string
 *           description: The username associated with the profile photo.
 *         fileID:
 *           type: string
 *           description: The unique identifier of the profile photo file.
 *         releaseDate:
 *           type: integer
 *           format: bigint
 *           description: The release date of the profile photo in Unix timestamp format.
 */

const ProfilePhoto = sequelize.define('ProfilePhoto', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userID: { type: DataTypes.STRING, unique: true, allowNull: false },
    userName: { type: DataTypes.STRING, unique: true, allowNull: false },
    fileID: { type: DataTypes.STRING, unique: true, allowNull: false },
    uploadDate: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'ProfilePhotos',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = ProfilePhoto;