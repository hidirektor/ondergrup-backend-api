const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionLog:
 *       type: object
 *       required:
 *          - sourceUserID
 *          - sourceUserName
 *          - operationSection
 *          - operationType
 *          - operationName
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the OTP log entry.
 *         sourceUserID:
 *           type: string
 *           description: Unique identifier for the source user
 *         sourceUserName:
 *           type: string
 *           description: Source user name
 *         affectedUserID:
 *           type: string
 *           description: Unique identifier for the user.
 *         affectedUserName:
 *           type: string
 *           description: Name of operator.
 *         affestedMachineID:
 *           type: string
 *           description: Affected machine id.
 *         affectedMaintenanceID:
 *           type: string
 *           description: Affected maintenance id.
 *         affectedHydraulicUnitID:
 *           type: string
 *           description: Affected hydraulic unit id.
 *         operationSection:
 *           type: string
 *           description: Section seperator for HYDRAULIC and EMBEDDED
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
 *         sourceUserID: "124141231231"
 *         sourceUserName: "hidirektor"
 *         affectedUserID: "512312312"
 *         affectedUserName: "hidirektor"
 *         operationSection: "EMBEDDED"
 *         operationType: "ADD"
 *         operationName: "Kullanıcı Kayıt Oldu"
 *         operationTime: 1628000000
 */

const ActionLog = sequelize.define('ActionLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sourceUserID: { type: DataTypes.STRING, allowNull: false },
    sourceNameSurname: { type: DataTypes.STRING, allowNull: false },
    affectedUserID: { type: DataTypes.STRING, allowNull: true },
    affectedUserName: { type: DataTypes.STRING, allowNull: true },
    affectedMachineID: { type: DataTypes.STRING, allowNull: true },
    affectedMaintenanceID: { type: DataTypes.INTEGER, allowNull: true },
    affectedHydraulicUnitID: { type: DataTypes.STRING, allowNull: true },
    operationPlatform: { type: DataTypes.STRING, allowNull: false },
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