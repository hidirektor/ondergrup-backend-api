const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     MachineData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the machine data entry.
 *           example: 1
 *         machineID:
 *           type: string
 *           description: Unique identifier for the machine.
 *           example: "MCH123456"
 *         wifiSSID:
 *           type: string
 *           description: WiFi SSID for the machine.
 *           example: "MyWiFiNetwork"
 *         wifiPass:
 *           type: string
 *           description: WiFi password for the machine.
 *           example: "MyWiFiPassword"
 *         devirmeYuruyusSecim:
 *           type: integer
 *           description: Selection for devirme yuruyus.
 *           example: 1
 *         calismaSekli:
 *           type: integer
 *           description: Working mode.
 *           example: 2
 *         emniyetCercevesi:
 *           type: integer
 *           description: Safety frame selection.
 *           example: 1
 *         yavaslamaLimit:
 *           type: integer
 *           description: Slowdown limit.
 *           example: 50
 *         altLimit:
 *           type: integer
 *           description: Lower limit.
 *           example: 20
 *         kapiTablaAcKonum:
 *           type: integer
 *           description: Door table open position.
 *           example: 30
 *         basincSalteri:
 *           type: integer
 *           description: Pressure switch setting.
 *           example: 1
 *         kapiSecimleri:
 *           type: integer
 *           description: Door selections.
 *           example: 3
 *         kapiAcTipi:
 *           type: integer
 *           description: Door open type.
 *           example: 1
 *         kapi1Tip:
 *           type: integer
 *           description: Type of door 1.
 *           example: 1
 *         kapi1AcSure:
 *           type: integer
 *           description: Door 1 open duration.
 *           example: 5
 *         kapi2Tip:
 *           type: integer
 *           description: Type of door 2.
 *           example: 2
 *         kapi2AcSure:
 *           type: integer
 *           description: Door 2 open duration.
 *           example: 6
 *         kapitablaTip:
 *           type: integer
 *           description: Table type.
 *           example: 2
 *         kapiTablaAcSure:
 *           type: integer
 *           description: Table open duration.
 *           example: 10
 *         yukariYavasLimit:
 *           type: integer
 *           description: Upper slow limit.
 *           example: 70
 *         devirmeYukariIleriLimit:
 *           type: integer
 *           description: Devirme upper forward limit.
 *           example: 60
 *         devirmeAsagiGeriLimit:
 *           type: integer
 *           description: Devirme lower back limit.
 *           example: 40
 *         devirmeSilindirTipi:
 *           type: integer
 *           description: Devirme cylinder type.
 *           example: 1
 *         platformSilindirTipi:
 *           type: integer
 *           description: Platform cylinder type.
 *           example: 2
 *         yukariValfTmr:
 *           type: integer
 *           description: Upper valve timer.
 *           example: 15
 *         asagiValfTmr:
 *           type: integer
 *           description: Lower valve timer.
 *           example: 10
 *         devirmeYukariIleriTmr:
 *           type: integer
 *           description: Devirme upper forward timer.
 *           example: 20
 *         devirmeAsagiGeriTmr:
 *           type: integer
 *           description: Devirme lower back timer.
 *           example: 18
 *         makineCalismaTmr:
 *           type: integer
 *           description: Machine working timer.
 *           example: 25
 *         buzzer:
 *           type: integer
 *           description: Buzzer setting.
 *           example: 1
 *         demoMode:
 *           type: integer
 *           description: Demo mode setting.
 *           example: 0
 *         calismaSayisi1:
 *           type: integer
 *           description: Working count in units.
 *           example: 100
 *         calismaSayisi10:
 *           type: integer
 *           description: Working count in tens.
 *           example: 200
 *         calismaSayisi100:
 *           type: integer
 *           description: Working count in hundreds.
 *           example: 300
 *         calismaSayisi1000:
 *           type: integer
 *           description: Working count in thousands.
 *           example: 400
 *         calismaSayisi10000:
 *           type: integer
 *           description: Working count in ten thousands.
 *           example: 500
 *         dilSecim:
 *           type: integer
 *           description: Language selection.
 *           example: 1
 *         eepromData38:
 *           type: integer
 *           description: EEPROM data at position 38.
 *           example: 255
 *         eepromData39:
 *           type: integer
 *           description: EEPROM data at position 39.
 *           example: 255
 *         eepromData40:
 *           type: integer
 *           description: EEPROM data at position 40.
 *           example: 255
 *         eepromData41:
 *           type: integer
 *           description: EEPROM data at position 41.
 *           example: 255
 *         eepromData42:
 *           type: integer
 *           description: EEPROM data at position 42.
 *           example: 255
 *         eepromData43:
 *           type: integer
 *           description: EEPROM data at position 43.
 *           example: 255
 *         eepromData44:
 *           type: integer
 *           description: EEPROM data at position 44.
 *           example: 255
 *         eepromData45:
 *           type: integer
 *           description: EEPROM data at position 45.
 *           example: 255
 *         eepromData46:
 *           type: integer
 *           description: EEPROM data at position 46.
 *           example: 255
 *         eepromData47:
 *           type: integer
 *           description: EEPROM data at position 47.
 *           example: 255
 *         lcdBacklightSure:
 *           type: integer
 *           description: LCD backlight duration.
 *           example: 60
 */

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