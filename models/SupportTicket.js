const sequelize = require("../config/database");
const {DataTypes} = require("sequelize");

const SupportTicket = sequelize.define('Tickets', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ownerID: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    ticketStatus: { type: DataTypes.STRING, allowNull: false },
    responses: { type: DataTypes.STRING, allowNull: false },
    createdDate: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
    }

}, {
    timestamps: false,
    tableName: 'Tickets',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = SupportTicket;