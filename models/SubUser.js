const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     SubUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the sub-user entry.
 *           example: 1
 *         ownerID:
 *           type: string
 *           description: Unique identifier for the owner.
 *           example: "OWNER123456"
 *         userID:
 *           type: string
 *           description: Unique identifier for the sub-user.
 *           example: "USER123456"
 */

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