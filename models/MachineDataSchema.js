const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MachineDataSchema = new Schema({
    MachineID: String,
    ProjectCode: String,
    acilStop1: Number,
    acilStop2: Number,
    acilStop3: Number,
    calismaSekli: Number,
    eCercevesi: Number,
    yavaslamaLimit: Number,
    altLimit: Number,
    basincSalter: Number,
    kapiSivici: Number,
    kapi1Tip: Number,
    kapi1acSure: Number,
    kapi2Tip: Number,
    kapi2acSure: Number,
    kapitablaTip: Number,
    kapiTablaSure: Number,
    yukariYavaslama: Number,
    devirmeYuruyusSecim: Number,
    devirmeYukariIleriLimit: Number,
    devirmeAsagiLimit: Number,
    devirmeSilindirTipi: Number,
    platformSilindirTipi: Number,
    yukarivalfDurusSuresi: Number,
    asagivalfDurusSuresi: Number,
    devirmevalfDurusSuresi: Number,
    devirme2valfDurusSuresi: Number,
    makineCalismaTmr: Number,
    buzzer: Number,
    dilSecimi: Number,
    kaydedilenDeger: Number,
    demoMod: Number,
    halil: Number,
    halil2: Number
});

module.exports = mongoose.model('machinedata', MachineDataSchema);
