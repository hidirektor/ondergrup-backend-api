const mysql = require('mysql2');
const path = require("path");
const util = require('util');

const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

module.exports = {
    addMachine: async(req, res, next) => {
        const { Username, CompanyName, MachineID } = req.body;

        try {
            connectionPool.getConnection((err, connection) => {
                if (err) {
                    console.error('Veritabanına bağlanırken hata oluştu:', err);
                    return res.status(500).json({ error: 'Veritabanı hatası.' });
                }

                const checkQuery = 'SELECT * FROM Machine WHERE Owner_UserName = ? AND MachineID = ?';
                const checkInserts = [Username, MachineID];
                const checkSql = mysql.format(checkQuery, checkInserts);

                connection.query(checkSql, (err, results) => {
                    if (err) {
                        connection.release();
                        console.error('Veri kontrol sırasında bir hata oluştu:', err);
                        return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                    }

                    if (results.length > 0) {
                        connection.release();
                        return res.status(400).json({ error: 'Bu kullanıcıya ait aynı makine zaten var.' });
                    }

                    const insertQuery = 'INSERT INTO Machine (Owner_UserName, CompanyName, MachineID) VALUES (?, ?, ?)';
                    const inserts = [Username, CompanyName, MachineID];
                    const sql = mysql.format(insertQuery, inserts);

                    connection.query(sql, (err, result) => {
                        connection.release();

                        if (err) {
                            console.error('Veri eklenirken bir hata oluştu:', err);
                            return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                        }

                        res.status(200).json({ message: 'Machine başarıyla eklendi.' });
                    });
                });
            });
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası.' });
        }
    },

    updateMachineData: async (req, res, next) => {
        const { machineID, machineData } = req.body;

        try {
            const dataArray = machineData.split('').map(Number);

            if (dataArray.length !== 45) {
                return res.status(400).json({ error: 'Invalid machineData format' });
            }

            connectionPool.getConnection((err, connection) => {
                const checkQuery = 'SELECT * FROM Machine WHERE MachineID = ?';
                const checkInserts = [machineID];
                const checkSql = mysql.format(checkQuery, checkInserts);

                connection.query(checkSql, (err, results) => {
                    if(err) {
                        connection.release();
                        return res.status(500).json({ error: 'Makine bulunamadı.' });
                    } else {
                        if(results.length === 0) {
                            console.error('Makine bulunamadı.', err);
                            return res.status(500).json({ error: 'Makine bulunamadı.' });
                        } else {
                            const secondCheckQuery = 'SELECT * FROM MachineData WHERE machineID = ?';
                            const secondCheckInserts = [machineID];
                            const secondCheckSql = mysql.format(secondCheckQuery, secondCheckInserts);

                            connection.query(secondCheckSql, (err, results) => {
                                if(err) {
                                    console.error('Makine kontrol hatası (MachineData):', err);
                                    return res.status(500).json({ error: 'Makine kontrol hatası (MachineData):' });
                                }

                                if(results.length === 0) {
                                    const insertQuery = 'INSERT INTO MachineData (machineID, devirmeYuruyusSecim, calismaSekli, emniyetCercevesi, yavaslamaLimit, altLimit, kapiTablaAcKonum, basincSalteri, kapiSecimleri, kapiAcTipi, kapi1Tip, kapi1AcSure, kapi2Tip, kapi2AcSure, kapitablaTip, kapiTablaAcSure, yukariYavasLimit, devirmeYukariIleriLimit, devirmeAsagiGeriLimit, devirmeSilindirTipi, platformSilindirTipi, yukariValfTmr, asagiValfTmr, devirmeYukariIleriTmr, devirmeAsagiGeriTmr, makineCalismaTmr, buzzer, demoMode, calismaSayisi1, calismaSayisi10, calismaSayisi100, calismaSayisi1000, calismaSayisi10000, dilSecim, eepromData37, eepromData38, eepromData39, eepromData40, eepromData41, eepromData42, eepromData43, eepromData44, eepromData45, eepromData46, eepromData47, lcdBacklightSure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                                    const inserts = [machineID, dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4], dataArray[5], dataArray[6], dataArray[7], dataArray[8], dataArray[9], dataArray[10], dataArray[11], dataArray[12], dataArray[13], dataArray[14], dataArray[15], dataArray[16], dataArray[17], dataArray[18], dataArray[19], dataArray[20], dataArray[21], dataArray[22], dataArray[23], dataArray[24], dataArray[25], dataArray[26], dataArray[27], dataArray[28], dataArray[29], dataArray[30], dataArray[31], dataArray[32], dataArray[33], dataArray[34], dataArray[35], dataArray[36], dataArray[37], dataArray[38], dataArray[39], dataArray[40], dataArray[41], dataArray[42], dataArray[43], dataArray[44], dataArray[44]];
                                    const sql = mysql.format(insertQuery, inserts);

                                    connection.query(sql, (err, result) => {
                                        if (err) {
                                            console.error('Veri eklenirken bir hata oluştu:', err);
                                            return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                                        }

                                        res.status(200).json({ message: 'Makine verileri başarıyla eklendi.' });
                                    });
                                } else {
                                    const updateFields = [
                                        'devirmeYuruyusSecim = ?',
                                        'calismaSekli = ?',
                                        'emniyetCercevesi = ?',
                                        'yavaslamaLimit = ?',
                                        'altLimit = ?',
                                        'kapiTablaAcKonum = ?',
                                        'basincSalteri = ?',
                                        'kapiSecimleri = ?',
                                        'kapiAcTipi = ?',
                                        'kapi1Tip = ?',
                                        'kapi1AcSure = ?',
                                        'kapi2Tip = ?',
                                        'kapi2AcSure = ?',
                                        'kapitablaTip = ?',
                                        'kapiTablaAcSure = ?',
                                        'yukariYavasLimit = ?',
                                        'devirmeYukariIleriLimit = ?',
                                        'devirmeAsagiGeriLimit = ?',
                                        'devirmeSilindirTipi = ?',
                                        'platformSilindirTipi = ?',
                                        'yukariValfTmr = ?',
                                        'asagiValfTmr = ?',
                                        'devirmeYukariIleriTmr = ?',
                                        'devirmeAsagiGeriTmr = ?',
                                        'makineCalismaTmr = ?',
                                        'buzzer = ?',
                                        'demoMode = ?',
                                        'calismaSayisi1 = ?',
                                        'calismaSayisi10 = ?',
                                        'calismaSayisi100 = ?',
                                        'calismaSayisi1000 = ?',
                                        'calismaSayisi10000 = ?',
                                        'dilSecim = ?',
                                        'eepromData37 = ?',
                                        'eepromData38 = ?',
                                        'eepromData39 = ?',
                                        'eepromData40 = ?',
                                        'eepromData41 = ?',
                                        'eepromData42 = ?',
                                        'eepromData43 = ?',
                                        'eepromData44 = ?',
                                        'eepromData45 = ?',
                                        'eepromData46 = ?',
                                        'eepromData47 = ?',
                                        'lcdBacklightSure = ?'
                                    ].join(', ');

                                    const updateQuery = `UPDATE MachineData SET ${updateFields} WHERE machineID = ?`;

                                    const updateParams = [
                                        dataArray[0],  // devirmeYuruyusSecim
                                        dataArray[1],  // calismaSekli
                                        dataArray[2],  // emniyetCercevesi
                                        dataArray[3],  // yavaslamaLimit
                                        dataArray[4],  // altLimit
                                        dataArray[5],  // kapiTablaAcKonum
                                        dataArray[6],  // basincSalteri
                                        dataArray[7],  // kapiSecimleri
                                        dataArray[8],  // kapiAcTipi
                                        dataArray[9],  // kapi1Tip
                                        dataArray[10], // kapi1AcSure
                                        dataArray[11], // kapi2Tip
                                        dataArray[12], // kapi2AcSure
                                        dataArray[13], // kapitablaTip
                                        dataArray[14], // kapiTablaAcSure
                                        dataArray[15], // yukariYavasLimit
                                        dataArray[16], // devirmeYukariIleriLimit
                                        dataArray[17], // devirmeAsagiGeriLimit
                                        dataArray[18], // devirmeSilindirTipi
                                        dataArray[19], // platformSilindirTipi
                                        dataArray[20], // yukariValfTmr
                                        dataArray[21], // asagiValfTmr
                                        dataArray[22], // devirmeYukariIleriTmr
                                        dataArray[23], // devirmeAsagiGeriTmr
                                        dataArray[24], // makineCalismaTmr
                                        dataArray[25], // buzzer
                                        dataArray[26], // demoMode
                                        dataArray[27], // calismaSayisi1
                                        dataArray[28], // calismaSayisi10
                                        dataArray[29], // calismaSayisi100
                                        dataArray[30], // calismaSayisi1000
                                        dataArray[31], // calismaSayisi10000
                                        dataArray[32], // dilSecim
                                        dataArray[33], // eepromData37
                                        dataArray[34], // eepromData38
                                        dataArray[35], // eepromData39
                                        dataArray[36], // eepromData40
                                        dataArray[37], // eepromData41
                                        dataArray[38], // eepromData42
                                        dataArray[39], // eepromData43
                                        dataArray[40], // eepromData44
                                        dataArray[41], // eepromData45
                                        dataArray[42], // eepromData46
                                        dataArray[43], // eepromData47
                                        dataArray[44], // lcdBacklightSure
                                        machineID      // machineID
                                    ];

                                    const sql = mysql.format(updateQuery, updateParams);
                                    connection.query(sql, (err, result) => {
                                        connection.release();

                                        if (err) {
                                            console.error('Veriler güncellenirken bir hata oluştu:', err);
                                            return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                                        }

                                        res.status(200).json({ message: 'Makine verileri başarıyla güncellendi.' });
                                    });
                                }
                            })
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Sorgu hatası:', error);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    updateMachineDataRaw: async (req, res, next) => {
        const machineID = req.query.machineID;
        const machineData = req.query.machineData;

        try {
            const dataArray = machineData.split('').map(Number);

            if (dataArray.length !== 45) {
                return res.status(400).json({ error: 'Invalid machineData format' });
            }

            connectionPool.getConnection((err, connection) => {
                const checkQuery = 'SELECT * FROM Machine WHERE MachineID = ?';
                const checkInserts = [machineID];
                const checkSql = mysql.format(checkQuery, checkInserts);

                connection.query(checkSql, (err, results) => {
                    if(err) {
                        connection.release();
                        return res.status(500).json({ error: 'Makine bulunamadı.' });
                    } else {
                        if(results.length === 0) {
                            console.error('Makine bulunamadı.', err);
                            return res.status(500).json({ error: 'Makine bulunamadı.' });
                        } else {
                            const secondCheckQuery = 'SELECT * FROM MachineData WHERE machineID = ?';
                            const secondCheckInserts = [machineID];
                            const secondCheckSql = mysql.format(secondCheckQuery, secondCheckInserts);

                            connection.query(secondCheckSql, (err, results) => {
                                if(err) {
                                    console.error('Makine kontrol hatası (MachineData):', err);
                                    return res.status(500).json({ error: 'Makine kontrol hatası (MachineData):' });
                                }

                                if(results.length === 0) {
                                    const insertQuery = 'INSERT INTO MachineData (machineID, devirmeYuruyusSecim, calismaSekli, emniyetCercevesi, yavaslamaLimit, altLimit, kapiTablaAcKonum, basincSalteri, kapiSecimleri, kapiAcTipi, kapi1Tip, kapi1AcSure, kapi2Tip, kapi2AcSure, kapitablaTip, kapiTablaAcSure, yukariYavasLimit, devirmeYukariIleriLimit, devirmeAsagiGeriLimit, devirmeSilindirTipi, platformSilindirTipi, yukariValfTmr, asagiValfTmr, devirmeYukariIleriTmr, devirmeAsagiGeriTmr, makineCalismaTmr, buzzer, demoMode, calismaSayisi1, calismaSayisi10, calismaSayisi100, calismaSayisi1000, calismaSayisi10000, dilSecim, eepromData37, eepromData38, eepromData39, eepromData40, eepromData41, eepromData42, eepromData43, eepromData44, eepromData45, eepromData46, eepromData47, lcdBacklightSure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                                    const inserts = [machineID, dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4], dataArray[5], dataArray[6], dataArray[7], dataArray[8], dataArray[9], dataArray[10], dataArray[11], dataArray[12], dataArray[13], dataArray[14], dataArray[15], dataArray[16], dataArray[17], dataArray[18], dataArray[19], dataArray[20], dataArray[21], dataArray[22], dataArray[23], dataArray[24], dataArray[25], dataArray[26], dataArray[27], dataArray[28], dataArray[29], dataArray[30], dataArray[31], dataArray[32], dataArray[33], dataArray[34], dataArray[35], dataArray[36], dataArray[37], dataArray[38], dataArray[39], dataArray[40], dataArray[41], dataArray[42], dataArray[43], dataArray[44], dataArray[44]];
                                    const sql = mysql.format(insertQuery, inserts);

                                    connection.query(sql, (err, result) => {
                                        if (err) {
                                            console.error('Veri eklenirken bir hata oluştu:', err);
                                            return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                                        }

                                        res.status(200).json({ message: 'Makine verileri başarıyla eklendi.' });
                                    });
                                } else {
                                    const updateFields = [
                                        'devirmeYuruyusSecim = ?',
                                        'calismaSekli = ?',
                                        'emniyetCercevesi = ?',
                                        'yavaslamaLimit = ?',
                                        'altLimit = ?',
                                        'kapiTablaAcKonum = ?',
                                        'basincSalteri = ?',
                                        'kapiSecimleri = ?',
                                        'kapiAcTipi = ?',
                                        'kapi1Tip = ?',
                                        'kapi1AcSure = ?',
                                        'kapi2Tip = ?',
                                        'kapi2AcSure = ?',
                                        'kapitablaTip = ?',
                                        'kapiTablaAcSure = ?',
                                        'yukariYavasLimit = ?',
                                        'devirmeYukariIleriLimit = ?',
                                        'devirmeAsagiGeriLimit = ?',
                                        'devirmeSilindirTipi = ?',
                                        'platformSilindirTipi = ?',
                                        'yukariValfTmr = ?',
                                        'asagiValfTmr = ?',
                                        'devirmeYukariIleriTmr = ?',
                                        'devirmeAsagiGeriTmr = ?',
                                        'makineCalismaTmr = ?',
                                        'buzzer = ?',
                                        'demoMode = ?',
                                        'calismaSayisi1 = ?',
                                        'calismaSayisi10 = ?',
                                        'calismaSayisi100 = ?',
                                        'calismaSayisi1000 = ?',
                                        'calismaSayisi10000 = ?',
                                        'dilSecim = ?',
                                        'eepromData37 = ?',
                                        'eepromData38 = ?',
                                        'eepromData39 = ?',
                                        'eepromData40 = ?',
                                        'eepromData41 = ?',
                                        'eepromData42 = ?',
                                        'eepromData43 = ?',
                                        'eepromData44 = ?',
                                        'eepromData45 = ?',
                                        'eepromData46 = ?',
                                        'eepromData47 = ?',
                                        'lcdBacklightSure = ?'
                                    ].join(', ');

                                    const updateQuery = `UPDATE MachineData SET ${updateFields} WHERE machineID = ?`;

                                    const updateParams = [
                                        dataArray[0],  // devirmeYuruyusSecim
                                        dataArray[1],  // calismaSekli
                                        dataArray[2],  // emniyetCercevesi
                                        dataArray[3],  // yavaslamaLimit
                                        dataArray[4],  // altLimit
                                        dataArray[5],  // kapiTablaAcKonum
                                        dataArray[6],  // basincSalteri
                                        dataArray[7],  // kapiSecimleri
                                        dataArray[8],  // kapiAcTipi
                                        dataArray[9],  // kapi1Tip
                                        dataArray[10], // kapi1AcSure
                                        dataArray[11], // kapi2Tip
                                        dataArray[12], // kapi2AcSure
                                        dataArray[13], // kapitablaTip
                                        dataArray[14], // kapiTablaAcSure
                                        dataArray[15], // yukariYavasLimit
                                        dataArray[16], // devirmeYukariIleriLimit
                                        dataArray[17], // devirmeAsagiGeriLimit
                                        dataArray[18], // devirmeSilindirTipi
                                        dataArray[19], // platformSilindirTipi
                                        dataArray[20], // yukariValfTmr
                                        dataArray[21], // asagiValfTmr
                                        dataArray[22], // devirmeYukariIleriTmr
                                        dataArray[23], // devirmeAsagiGeriTmr
                                        dataArray[24], // makineCalismaTmr
                                        dataArray[25], // buzzer
                                        dataArray[26], // demoMode
                                        dataArray[27], // calismaSayisi1
                                        dataArray[28], // calismaSayisi10
                                        dataArray[29], // calismaSayisi100
                                        dataArray[30], // calismaSayisi1000
                                        dataArray[31], // calismaSayisi10000
                                        dataArray[32], // dilSecim
                                        dataArray[33], // eepromData37
                                        dataArray[34], // eepromData38
                                        dataArray[35], // eepromData39
                                        dataArray[36], // eepromData40
                                        dataArray[37], // eepromData41
                                        dataArray[38], // eepromData42
                                        dataArray[39], // eepromData43
                                        dataArray[40], // eepromData44
                                        dataArray[41], // eepromData45
                                        dataArray[42], // eepromData46
                                        dataArray[43], // eepromData47
                                        dataArray[44]*10, // lcdBacklightSure
                                        machineID      // machineID
                                    ];

                                    const sql = mysql.format(updateQuery, updateParams);
                                    connection.query(sql, (err, result) => {
                                        connection.release();

                                        if (err) {
                                            console.error('Veriler güncellenirken bir hata oluştu:', err);
                                            return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                                        }

                                        res.status(200).json({ message: 'Makine verileri başarıyla güncellendi.' });
                                    });
                                }
                            })
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Sorgu hatası:', error);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    checkMachineID: async (req, res, next) => {
        const machineID = req.query.machineID;

        const queryAsync = util.promisify(connectionPool.query).bind(connectionPool);

        try {
            const results = await queryAsync('SELECT * FROM Machine WHERE MachineID = ?', [machineID]);

            if (results.length > 0) {
                return res.status(400).json({ error: 'Machine ID already exists.' });
            } else {
                return res.status(200).json({ message: 'Machine ID is available.' });
            }
        } catch (error) {
            console.error('Veritabanı sorgu hatası:', error);
            return res.status(500).json({ error: 'Sunucu hatası.' });
        }
    },

    getMachines: async (req, res, next) => {
        const { username } = req.body;

        connectionPool.getConnection((err, connection) => {
            if (err) {
                console.error('Veritabanına bağlanırken hata oluştu:', err);
                return res.status(500).json({ error: 'Veritabanı hatası.' });
            }

            const machineQuery = 'SELECT MachineID, Owner_UserName, MachineType, LastUpdate FROM Machine WHERE Owner_UserName = ?';
            const machineInserts = [username];
            const machineSelectQuery = mysql.format(machineQuery, machineInserts);

            connection.query(machineSelectQuery, (err, machineRows) => {
                if (err) {
                    connection.release();
                    console.error('Machine tablosundan veri alınırken bir hata oluştu:', err);
                    return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                }

                if (machineRows.length === 0) {
                    connection.release();
                    return res.status(404).json({ error: 'Veri bulunamadı.' });
                }

                let machines = [];

                machineRows.forEach((machineRow) => {
                    const machineID = machineRow.MachineID;
                    const machineDataQuery = 'SELECT * FROM MachineData WHERE MachineID = ?';
                    const machineDataInserts = [machineID];
                    const machineDataSelectQuery = mysql.format(machineDataQuery, machineDataInserts);

                    connection.query(machineDataSelectQuery, (err, machineDataRows) => {
                        if (err) {
                            connection.release();
                            console.error('MachineData tablosundan veri alınırken bir hata oluştu:', err);
                            return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
                        }

                        const machine = {
                            MachineInfo: machineRow,
                            MachineData: machineDataRows
                        };

                        machines.push(machine);

                        if (machines.length === machineRows.length) {
                            connection.release();
                            res.status(200).json({ machines: machines });
                        }
                    });
                });
            });
        });
    },

    getMachineErrors: async(req, res, next) => {
        const { machineID } = req.body;

        const queryAsync = util.promisify(connectionPool.query).bind(connectionPool);

        try {
            const results = await queryAsync('SELECT * FROM MachineErrors WHERE MachineID = ?', [machineID]);

            if(results.length > 0) {
                return res.status(200).json({ data: results });
            } else {
                return res.status(400).json({error : 'Theres no error situtation for that machine.'})
            }
        } catch(error) {
            console.error('Veritabanı sorgu hatası: ', error);
            return res.status(500).json({error: 'Sunucu hatası.'})
        }
    }
}
