const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     MachineData:
 *       type: object
 *       required:
 *          - machineID
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the machine data entry.
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine.
 *         wifiSSID:
 *           type: string
 *           description: WiFi SSID for the machine.
 *         wifiPass:
 *           type: string
 *           description: WiFi password for the machine.
 *         devirmeYuruyusSecim:
 *           type: integer
 *           description: Selection for devirme yuruyus.
 *         calismaSekli:
 *           type: integer
 *           description: Working mode.
 *         emniyetCercevesi:
 *           type: integer
 *           description: Safety frame selection.
 *         yavaslamaLimit:
 *           type: integer
 *           description: Slowdown limit.
 *         altLimit:
 *           type: integer
 *           description: Lower limit.
 *         kapiTablaAcKonum:
 *           type: integer
 *           description: Door table open position.
 *         basincSalteri:
 *           type: integer
 *           description: Pressure switch setting.
 *         kapiSecimleri:
 *           type: integer
 *           description: Door selections.
 *         kapiAcTipi:
 *           type: integer
 *           description: Door open type.
 *         kapi1Tip:
 *           type: integer
 *           description: Type of door 1.
 *         kapi1AcSure:
 *           type: integer
 *           description: Door 1 open duration.
 *         kapi2Tip:
 *           type: integer
 *           description: Type of door 2.
 *         kapi2AcSure:
 *           type: integer
 *           description: Door 2 open duration.
 *         kapitablaTip:
 *           type: integer
 *           description: Table type.
 *         kapiTablaAcSure:
 *           type: integer
 *           description: Table open duration.
 *         yukariYavasLimit:
 *           type: integer
 *           description: Upper slow limit.
 *         devirmeYukariIleriLimit:
 *           type: integer
 *           description: Devirme upper forward limit.
 *         devirmeAsagiGeriLimit:
 *           type: integer
 *           description: Devirme lower back limit.
 *         devirmeSilindirTipi:
 *           type: integer
 *           description: Devirme cylinder type.
 *         platformSilindirTipi:
 *           type: integer
 *           description: Platform cylinder type.
 *         yukariValfTmr:
 *           type: integer
 *           description: Upper valve timer.
 *         asagiValfTmr:
 *           type: integer
 *           description: Lower valve timer.
 *         devirmeYukariIleriTmr:
 *           type: integer
 *           description: Devirme upper forward timer.
 *         devirmeAsagiGeriTmr:
 *           type: integer
 *           description: Devirme lower back timer.
 *         makineCalismaTmr:
 *           type: integer
 *           description: Machine working timer.
 *         buzzer:
 *           type: integer
 *           description: Buzzer setting.
 *         demoMode:
 *           type: integer
 *           description: Demo mode setting.
 *         calismaSayisi:
 *           type: integer
 *           description: Working count in units.
 *         calismaSayisiDemo:
 *           type: integer
 *           description: Working count in tens.
 *         dilSecim:
 *           type: integer
 *           description: Language selection.
 *         eepromData38:
 *           type: integer
 *           description: EEPROM data at position 38.
 *         eepromData39:
 *           type: integer
 *           description: EEPROM data at position 39.
 *         eepromData40:
 *           type: integer
 *           description: EEPROM data at position 40.
 *         eepromData41:
 *           type: integer
 *           description: EEPROM data at position 41.
 *         eepromData42:
 *           type: integer
 *           description: EEPROM data at position 42.
 *         eepromData43:
 *           type: integer
 *           description: EEPROM data at position 43.
 *         eepromData44:
 *           type: integer
 *           description: EEPROM data at position 44.
 *         eepromData45:
 *           type: integer
 *           description: EEPROM data at position 45.
 *         eepromData46:
 *           type: integer
 *           description: EEPROM data at position 46.
 *         eepromData47:
 *           type: integer
 *           description: EEPROM data at position 47.
 *         lcdBacklightSure:
 *           type: integer
 *           description: LCD backlight duration.
 *       example:
 *          machineID: "12345"
 *          wifiSSID: "hidirektor"
 *          wifiPass: "hidirektor"
 *          devirmeYuruyusSecim: 1
 *          calismaSekli: 1
 *          emniyetCercevesi: 1
 *          yavaslamaLimit: 1
 *          altLimit: 0
 *          kapiTablaAcKonum: 1
 *          basincSalteri: 1
 *          kapiSecimleri: 1
 *          kapiAcTipi: 1
 *          kapi1Tip: 1
 *          kapi1AcSure: 60
 *          kapi2Tip: 1
 *          kapi2AcSure: 60
 *          kapitablaTip: 1
 *          kapiTablaAcSure: 60
 *          yukariYavasLimit: 1
 *          devirmeYukariIleriLimit: 1
 *          devirmeAsagiGeriLimit: 1
 *          devirmeSilindirTipi: 1
 *          platformSilindirTipi: 1
 *          yukariValfTmr: 1
 *          asagiValfTmr: 1
 *          devirmeYukariIleriTmr: 1
 *          devirmeAsagiGeriTmr: 1
 *          makineCalismaTmr: 1
 *          buzzer: 1
 *          demoMode: 1
 *          calismaSayisi: 255
 *          calismaSayisiDemo: 255
 *          dilSecim: 1
 *          eepromData38: 1
 *          eepromData39: 1
 *          eepromData40: 6
 *          eepromData41: 5
 *          eepromData42: 3
 *          eepromData43: 2
 *          eepromData44: 1
 *          eepromData45: 1
 *          eepromData46: 1
 *          eepromData47: 1
 *          lcdBacklightSure: 60
 */

const MachineData = sequelize.define('MachineData', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    machineID: { type: DataTypes.STRING, allowNull: false },
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
    calismaSayisi: { type: DataTypes.INTEGER, allowNull: true },
    calismaSayisiDemo: { type: DataTypes.INTEGER, allowNull: true },
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