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

            if (dataArray.length !== 44) {
                return res.status(400).json({ error: 'Invalid machineData format' });
            }

            connectionPool.getConnection((err, connection) => {
                const secondCheckQuery = 'SELECT * FROM MachineData WHERE machineID = ?';
                const secondCheckInserts = [machineID];
                const secondCheckSql = mysql.format(secondCheckQuery, secondCheckInserts);

                connection.query(secondCheckSql, (err, results) => {
                    if(err) {
                        console.error('Makine kontrol hatası (MachineData):', err);
                        return res.status(500).json({ error: 'Makine kontrol hatası (MachineData):' });
                    }

                    if(results.length === 0) {
                        const insertQuery = 'INSERT INTO MachineData (machineID, devirmeYuruyusSecim, calismaSekli, emniyetCercevesi, yavaslamaLimit, altLimit, kapiTablaAcKonum, basincSalteri, kapiSecimleri, kapiAcTipi, kapi1Tip, kapi1AcSure, kapi2Tip, kapi2AcSure, kapitablaTip, kapiTablaAcSure, yukariYavasLimit, devirmeYukariIleriLimit, devirmeAsagiGeriLimit, devirmeSilindirTipi, platformSilindirTipi, yukariValfTmr, asagiValfTmr, devirmeYukariIleriTmr, devirmeAsagiGeriTmr, makineCalismaTmr, buzzer, demoMode, calismaSayisi1, calismaSayisi10, calismaSayisi100, calismaSayisi1000, calismaSayisi10000, dilSecim, eepromData38, eepromData39, eepromData40, eepromData41, eepromData42, eepromData43, eepromData44, eepromData45, eepromData46, eepromData47, lcdBacklightSure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                        const inserts = [machineID, dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4], dataArray[5], dataArray[6], dataArray[7], dataArray[8], dataArray[9], dataArray[10], dataArray[11], dataArray[12], dataArray[13], dataArray[14], dataArray[15], dataArray[16], dataArray[17], dataArray[18], dataArray[19], dataArray[20], dataArray[21], dataArray[22], dataArray[23], dataArray[24], dataArray[25], dataArray[26], dataArray[27], dataArray[28], dataArray[29], dataArray[30], dataArray[31], dataArray[32], dataArray[33], dataArray[34], dataArray[35], dataArray[36], dataArray[37], dataArray[38], dataArray[39], dataArray[40], dataArray[41], dataArray[42], dataArray[43], dataArray[44]];
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
                            dataArray[33], // eepromData38
                            dataArray[34], // eepromData39
                            dataArray[35], // eepromData40
                            dataArray[36], // eepromData41
                            dataArray[37], // eepromData42
                            dataArray[38], // eepromData43
                            dataArray[39], // eepromData44
                            dataArray[40], // eepromData45
                            dataArray[41], // eepromData46
                            dataArray[42], // eepromData47
                            dataArray[43]*10, // lcdBacklightSure
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
            });
        } catch (error) {
            console.error('Sorgu hatası:', error);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    updateMachineDataRaw: async (req, res, next) => {
        const machineID = req.query.machineID;
        const wifiSSID = req.query.wifiSSID;
        const wifiPass = req.query.wifiPass;
        const machineData = req.query.machineData;

        try {
            const dataArray = machineData.split('').map(Number);

            if (dataArray.length !== 44) {
                return res.status(400).json({ error: 'Invalid machineData format' });
            }

            connectionPool.getConnection((err, connection) => {
                const secondCheckQuery = 'SELECT * FROM MachineData WHERE machineID = ?';
                const secondCheckInserts = [machineID];
                const secondCheckSql = mysql.format(secondCheckQuery, secondCheckInserts);

                connection.query(secondCheckSql, (err, results) => {
                    if(err) {
                        console.error('Makine kontrol hatası (MachineData):', err);
                        return res.status(500).json({ error: 'Makine kontrol hatası (MachineData):' });
                    }

                    if(results.length === 0) {
                        const insertQuery = 'INSERT INTO MachineData (machineID, wifiSSID, wifiPass, devirmeYuruyusSecim, calismaSekli, emniyetCercevesi, yavaslamaLimit, altLimit, kapiTablaAcKonum, basincSalteri, kapiSecimleri, kapiAcTipi, kapi1Tip, kapi1AcSure, kapi2Tip, kapi2AcSure, kapitablaTip, kapiTablaAcSure, yukariYavasLimit, devirmeYukariIleriLimit, devirmeAsagiGeriLimit, devirmeSilindirTipi, platformSilindirTipi, yukariValfTmr, asagiValfTmr, devirmeYukariIleriTmr, devirmeAsagiGeriTmr, makineCalismaTmr, buzzer, demoMode, calismaSayisi1, calismaSayisi10, calismaSayisi100, calismaSayisi1000, calismaSayisi10000, dilSecim, eepromData38, eepromData39, eepromData40, eepromData41, eepromData42, eepromData43, eepromData44, eepromData45, eepromData46, eepromData47, lcdBacklightSure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                        const inserts = [machineID, wifiSSID, wifiPass, dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4], dataArray[5], dataArray[6], dataArray[7], dataArray[8], dataArray[9], dataArray[10], dataArray[11], dataArray[12], dataArray[13], dataArray[14], dataArray[15], dataArray[16], dataArray[17], dataArray[18], dataArray[19], dataArray[20], dataArray[21], dataArray[22], dataArray[23], dataArray[24], dataArray[25], dataArray[26], dataArray[27], dataArray[28], dataArray[29], dataArray[30], dataArray[31], dataArray[32], dataArray[33], dataArray[34], dataArray[35], dataArray[36], dataArray[37], dataArray[38], dataArray[39], dataArray[40], dataArray[41], dataArray[42], dataArray[43], dataArray[44]];
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
                            'wifiSSID = ?',
                            'wifiPass = ?',
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
                            wifiSSID,
                            wifiPass,
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
                            dataArray[33], // eepromData38
                            dataArray[34], // eepromData39
                            dataArray[35], // eepromData40
                            dataArray[36], // eepromData41
                            dataArray[37], // eepromData42
                            dataArray[38], // eepromData43
                            dataArray[39], // eepromData44
                            dataArray[40], // eepromData45
                            dataArray[41], // eepromData46
                            dataArray[42], // eepromData47
                            dataArray[43]*10, // lcdBacklightSure
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

    createMaintenance: async (req, res, next) => {
        const {
            MachineID,
            Technician,
            maintenance1,
            maintenance2,
            maintenance3,
            maintenance4,
            maintenance5,
            maintenance6,
            maintenance7,
            maintenance8,
            notes
        } = req.body;

        try {
            connectionPool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    return res.status(500).json({ error: 'Database connection error' });
                }

                const now = new Date();
                const maintenanceDate = Math.floor(now.getTime() / 1000); // Convert to UNIX timestamp

                const insertQuery = `
                INSERT INTO MachineMaintenances 
                    (machineID, technician, maintenanceDate, \`kontrol1-1\`, \`kontrol1-2\`, \`kontrol1-3\`, \`kontrol1-4\`,
                        \`kontrol2-1\`, \`kontrol2-2\`, \`kontrol2-3\`, \`kontrol2-4\`,
                        \`kontrol3-1\`, \`kontrol3-2\`, \`kontrol3-3\`, \`kontrol3-4\`, \`kontrol3-5\`, \`kontrol3-6\`,
                        \`kontrol4-1\`, \`kontrol4-2\`, \`kontrol4-3\`, \`kontrol4-4\`, \`kontrol4-5\`, \`kontrol4-6\`,
                        \`kontrol5-1\`, \`kontrol5-2\`, \`kontrol5-3\`, \`kontrol5-4\`, \`kontrol5-5\`, \`kontrol5-6\`,
                        \`kontrol6-1\`, \`kontrol6-2\`, \`kontrol6-3\`,
                        \`kontrol7-1\`, \`kontrol7-2\`,
                        \`kontrol8-1\`, \`kontrol8-2\`, \`kontrol8-3\`,
                        \`kontrol9-1\`, \`kontrol9-2\`, \`kontrol9-3\`, \`kontrol9-4\`, \`kontrol9-5\`, \`kontrol9-6\`, \`kontrol9-7\`, \`kontrol9-8\`, \`kontrol9-9\`, \`kontrol9-10\`)
                        VALUES 
                        (?, ?, FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

                const queryParams = [
                    MachineID,
                    Technician,
                    maintenanceDate,
                    ...maintenance1,
                    ...maintenance2,
                    ...maintenance3,
                    ...maintenance4,
                    ...maintenance5,
                    ...maintenance6,
                    ...maintenance7,
                    ...maintenance8,
                    ...notes
                ];

                connection.query(insertQuery, queryParams, function (err, results) {
                    connection.release();

                    if (err) {
                        console.error('Query error:', err);
                        return res.status(500).json({ error: 'Server error' });
                    }

                    res.status(200).json({ message: 'Maintenance record created successfully', id: results.insertId });
                });
            });
        } catch (err) {
            console.error('Operation error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    updateOwner: async (req, res, next) => {
        const { MachineID, Owner } = req.body;

        try {
            connectionPool.getConnection(function(err, connection) {
                if (err) {
                    console.error('Veritabanı bağlantısı hatası:', err);
                    return res.status(500).json({ error: 'Veritabanı bağlantısı hatası' });
                }

                const findUserQuery = `SELECT * FROM Machine WHERE MachineID = ?`;
                connection.query(findUserQuery, [MachineID], function(err, results) {
                    if (err) {
                        connection.release();
                        console.error('Sorgu hatası:', err);
                        return res.status(500).json({ error: 'Sunucu hatası' });
                    }

                    if (results.length === 0) {
                        connection.release();
                        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
                    }

                    const user = results[0];

                    const updateRoleQuery = `UPDATE Machine SET Owner_UserName = ? WHERE MachineID = ?`;
                    connection.query(updateRoleQuery, [Owner, MachineID], function(err, updateResult) {
                        connection.release();

                        if (err) {
                            console.error('Güncelleme hatası:', err);
                            return res.status(500).json({ error: 'Sunucu hatası' });
                        }

                        res.status(200).json({ message: 'Makine sahibi güncellendi' });
                    });
                });
            });
        } catch (err) {
            console.error('İşlem hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    getAllMachines: async (req, res, next) => {
        const { username } = req.body;

        connectionPool.getConnection((err, connection) => {
            if (err) {
                console.error('Veritabanına bağlanırken hata oluştu:', err);
                return res.status(500).json({ error: 'Veritabanı hatası.' });
            }

            const machineQuery = 'SELECT * FROM Machine';

            connection.query(machineQuery, (err, machineRows) => {
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
    },

    getMachineMaintenances: async(req, res, next) => {
        const { machineID } = req.body;

        const queryAsync = util.promisify(connectionPool.query).bind(connectionPool);

        try {
            const results = await queryAsync('SELECT * FROM MachineMaintenances WHERE machineID = ?', [machineID]);

            if(results.length > 0) {
                return res.status(200).json({ data: results });
            } else {
                return res.status(400).json({error : 'Theres no maintenance situtation for that machine.'})
            }
        } catch(error) {
            console.error('Veritabanı sorgu hatası: ', error);
            return res.status(500).json({error: 'Sunucu hatası.'})
        }
    },

    getMachineErrorsAll: async(req, res, next) => {
        const queryAsync = util.promisify(connectionPool.query).bind(connectionPool);

        try {
            const userMachines = await queryAsync('SELECT MachineID FROM Machine');

            const machineErrors = await queryAsync('SELECT * FROM MachineErrors WHERE machineID IN (?)', [userMachines.map(machine => machine.MachineID)]);

            if(machineErrors.length > 0) {
                return res.status(200).json({ data: machineErrors });
            } else {
                return res.status(400).json({error : 'Theres no error situtation for that machine.'})
            }
        } catch(error) {
            console.error('Veritabanı sorgu hatası: ', error);
            return res.status(500).json({error: 'Sunucu hatası.'})
        }
    },

    getMachineMaintenancesAll: async(req, res, next) => {
        const queryAsync = util.promisify(connectionPool.query).bind(connectionPool);

        try {
            const userMachines = await queryAsync('SELECT MachineID FROM Machine');

            const machineErrors = await queryAsync('SELECT * FROM MachineMaintenances WHERE machineID IN (?)', [userMachines.map(machine => machine.MachineID)]);

            if(machineErrors.length > 0) {
                return res.status(200).json({ data: machineErrors });
            } else {
                return res.status(400).json({error : 'Theres no error situtation for that machine.'})
            }
        } catch(error) {
            console.error('Veritabanı sorgu hatası: ', error);
            return res.status(500).json({error: 'Sunucu hatası.'})
        }
    }
}
