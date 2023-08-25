const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata:', err);
    } else {
        console.log('Veritabanına başarıyla bağlandı');
    }
});

function insertHidrolik(req, res) {
    const { OrderNumber, OrderDate, Type, InCharge, PDF, PartList } = req.body;
    const Siparis_Tarihi = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery = `INSERT INTO HidrolikUnit (unitID, UserName, Siparis_Numarasi, Siparis_Tarihi, Unite_Tipi, Pdf_File, Excel_File, Created_By)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(insertQuery, [OrderNumber, InCharge, OrderNumber, Siparis_Tarihi, Type, PDF, PartList, InCharge], (err, results) => {
        if (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        } else {
            res.status(200).json({ message: 'Hidrolik başarıyla eklendi' });
        }
    });
}

module.exports = insertHidrolik;
