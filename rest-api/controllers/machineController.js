const mysql = require('mysql2');
const path = require("path");

const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

module.exports = {
    insertMachineData: async (req, res, next) => {
        const { machineID, projectCode, machineData } = req.body;

        try {
            const dataArray = machineData.split('').map(Number);

            if (dataArray.length !== 32) {
                return res.status(400).json({ error: 'Invalid machineData format' });
            }

            const machineDataObj = {
                MachineID: machineID,
                ProjectCode: projectCode,
                acilStop1: dataArray[0],
                acilStop2: dataArray[1],
                acilStop3: dataArray[2],
                calismaSekli: dataArray[3],
                eCercevesi: dataArray[4],
                yavaslamaLimit: dataArray[5],
                altLimit: dataArray[6],
                basincSalter: dataArray[7],
                kapiSivici: dataArray[8],
                kapi1Tip: dataArray[9],
                kapi1acSure: dataArray[10],
                kapi2Tip: dataArray[11],
                kapi2acSure: dataArray[12],
                kapitablaTip: dataArray[13],
                kapiTablaSure: dataArray[14],
                yukariYavaslama: dataArray[15],
                devirmeYuruyusSecim: dataArray[16],
                devirmeYukariIleriLimit: dataArray[17],
                devirmeAsagiLimit: dataArray[18],
                devirmeSilindirTipi: dataArray[19],
                platformSilindirTipi: dataArray[20],
                yukarivalfDurusSuresi: dataArray[21],
                asagivalfDurusSuresi: dataArray[22],
                devirmevalfDurusSuresi: dataArray[23],
                devirme2valfDurusSuresi: dataArray[24],
                makineCalismaTmr: dataArray[25],
                buzzer: dataArray[26],
                dilSecimi: dataArray[27],
                kaydedilenDeger: dataArray[28],
                demoMod: dataArray[29],
                halil: dataArray[30],
                halil2: dataArray[31]
            };

            await MachineDataModel.create(machineDataObj);

            res.status(200).json({ message: 'Machine Data başarıyla eklendi' });
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    }
}
