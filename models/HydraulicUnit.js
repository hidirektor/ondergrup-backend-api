const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 *  components:
 *    schemas:
 *      HydraulicUnit:
 *        type: object
 *        required:
 *          - userID
 *          - userName
 *          - orderID
 *          - partListID
 *          - schematicID
 *          - hydraulicType
 *        properties:
 *          id:
 *            type: integer
 *            description: Auto-incrementing primary key
 *          userID:
 *            type: string
 *            description: Unique identifier for the user
 *          userName:
 *            type: string
 *            description: Unique username
 *          orderID:
 *            type: string
 *            description: Unique identifier for the order
 *          partListID:
 *            type: string
 *            description: Unique identifier for the part list
 *          schematicID:
 *            type: string
 *            description: Unique identifier for the schematic
 *          hydraulicType:
 *            type: string
 *            description: Type of hydraulic unit
 *          createdDate:
 *            type: integer
 *            description: Timestamp of the creation date
 *        example:
 *          userID: "12345"
 *          userName: "hidirektor"
 *          orderID: "order123"
 *          partListID: "partList123"
 *          schematicID: "schematic123"
 *          hydraulicType: "TypeA"
 *          createdDate: 1622547802
 */

const HydraulicUnit = sequelize.define('HydraulicUnit', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userID: { type: DataTypes.STRING, unique: false, allowNull: false },
    userName: { type: DataTypes.STRING, unique: false, allowNull: false },
    orderID: { type: DataTypes.STRING, unique: true, allowNull: false },
    partListID: { type: DataTypes.STRING, unique: true, allowNull: false },
    schematicID: { type: DataTypes.STRING, unique: true, allowNull: false },
    hydraulicType: {type: DataTypes.STRING, allowNull: false },
    createdDate: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'HydraulicUnits',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = HydraulicUnit;