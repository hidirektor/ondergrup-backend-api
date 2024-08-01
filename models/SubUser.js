const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     SubUser:
 *       type: object
 *       required:
 *          - ownerID
 *          - userID
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the sub-user entry.
 *         ownerID:
 *           type: string
 *           description: Unique identifier for the owner.
 *         userID:
 *           type: string
 *           description: Unique identifier for the sub-user.
 *       example:
 *          ownerID: "12345asdasd13"
 *          userID: "asdasdasd12312"
 */

const SubUser = sequelize.define('SubUser', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ownerID: { type: DataTypes.STRING, allowNull: false },
    userID: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    tableName: 'SubUsers',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = SubUser;