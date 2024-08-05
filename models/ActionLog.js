const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionLog:
 *       type: object
 *       required:
 *          - userID
 *          - operationType
 *          - operationName
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the OTP log entry.
 *         userID:
 *           type: string
 *           description: Unique identifier for the user.
 *         operationType:
 *           type: string
 *           description: Type of ActionLog (e.g., ADD, OTP, CREATE).
 *         operationName:
 *           type: string
 *           description: Created machine.
 *         operationTime:
 *           type: integer
 *           description: Timestamp of when the ActionLog was created.
 *       example:
 *          userID: "12345"
 *          operationType: "ADD"
 *          operationName: "Makine Ekleme"
 *          operationTime: 1628000000
 */

const ActionLog = sequelize.define('ActionLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userID: { type: DataTypes.STRING, allowNull: false },
    operationType: { type: DataTypes.STRING, allowNull: false },
    operationName: { type: DataTypes.STRING, allowNull: false },
    operationTime: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'ActionLog',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = ActionLog;