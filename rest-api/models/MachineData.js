const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MachineData = sequelize.define('MachineData', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    machineID: { type: DataTypes.STRING, unique: true, allowNull: false },
    wifiSSID: { type: DataTypes.STRING, allowNull: true },
    wifiPass: { type: DataTypes.STRING, allowNull: true },
    devirmeYuruyusSecim: { type: DataTypes.INTEGER, allowNull: true },
    calismaSekli: { type: DataTypes.INTEGER, allowNull: true },
    emniyetCercevesi: { type: DataTypes.INTEGER, allowNull: true },
    yavaslamaLimit: { type: DataTypes.INTEGER, allowNull: true },
    altLimit: { type: DataTypes.INTEGER, allowNull: true },
    kapiTablaAcKonum: { type: DataTypes.INTEGER, allowNull: true },
    basincSalteri: { type: DataTypes.INTEGER, allowNull: true },
    kapiSecimleri: { type: DataTypes.INTEGER, allowNull: true },
    kapiAcTipi: { type: DataTypes.INTEGER, allowNull: true },
    kapi1Tip: { type: DataTypes.INTEGER, allowNull: true },
    kapi1AcSure: { type: DataTypes.INTEGER, allowNull: true },
    kapi2Tip: { type: DataTypes.INTEGER, allowNull: true },
    kapi2AcSure: { type: DataTypes.INTEGER, allowNull: true },
    kapitablaTip: { type: DataTypes.INTEGER, allowNull: true },
    kapiTablaAcSure: { type: DataTypes.INTEGER, allowNull: true },
    yukariYavasLimit: { type: DataTypes.INTEGER, allowNull: true },
    devirmeYukariIleriLimit: { type: DataTypes.INTEGER, allowNull: true },
    devirmeAsagiGeriLimit: { type: DataTypes.INTEGER, allowNull: true },
    devirmeSilindirTipi: { type: DataTypes.INTEGER, allowNull: true },
    platformSilindirTipi: { type: DataTypes.INTEGER, allowNull: true },
    yukariValfTmr: { type: DataTypes.INTEGER, allowNull: true },
    asagiValfTmr: { type: DataTypes.INTEGER, allowNull: true },
    devirmeYukariIleriTmr: { type: DataTypes.INTEGER, allowNull: true },
    devirmeAsagiGeriTmr: { type: DataTypes.INTEGER, allowNull: true },
    makineCalismaTmr: { type: DataTypes.INTEGER, allowNull: true },
    buzzer: { type: DataTypes.INTEGER, allowNull: true },
    demoMode: { type: DataTypes.INTEGER, allowNull: true },
    calismaSayisi1: { type: DataTypes.INTEGER, allowNull: true },
    calismaSayisi10: { type: DataTypes.INTEGER, allowNull: true },
    calismaSayisi100: { type: DataTypes.INTEGER, allowNull: true },
    calismaSayisi1000: { type: DataTypes.INTEGER, allowNull: true },
    calismaSayisi10000: { type: DataTypes.INTEGER, allowNull: true },
    dilSecim: { type: DataTypes.INTEGER, allowNull: true },
    eepromData38: { type: DataTypes.INTEGER, allowNull: true },
    eepromData39: { type: DataTypes.INTEGER, allowNull: true },
    eepromData40: { type: DataTypes.INTEGER, allowNull: true },
    eepromData41: { type: DataTypes.INTEGER, allowNull: true },
    eepromData42: { type: DataTypes.INTEGER, allowNull: true },
    eepromData43: { type: DataTypes.INTEGER, allowNull: true },
    eepromData44: { type: DataTypes.INTEGER, allowNull: true },
    eepromData45: { type: DataTypes.INTEGER, allowNull: true },
    eepromData46: { type: DataTypes.INTEGER, allowNull: true },
    eepromData47: { type: DataTypes.INTEGER, allowNull: true },
    lcdBacklightSure: { type: DataTypes.INTEGER, allowNull: true }

}, {
    timestamps: false,
    tableName: 'MachineData',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = MachineData;