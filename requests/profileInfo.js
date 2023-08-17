const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "89.252.138.99",
    user: "hidirekt_onder",
    password: "zDRd*~[z}+sX",
    database: "hidirekt_ondergrup",
    connectionLimit: 10
});

router.post('/:field', (req, res) => {
    const field = req.params.field;
    const value = req.body[field];

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Veritabanına bağlanırken hata oluştu:', err);
            return res.status(500).json({ error: 'Veritabanı hatası.' });
        }

        const sql = 'SELECT ?? FROM ?? WHERE UserName = ?';
        const inserts = [field.substring(1), 'Users', req.body.Username];
        const query = mysql.format(sql, inserts);

        connection.query(query, (err, rows) => {
            connection.release();

            if (err) {
                console.error('Profil bilgisi alınırken bir hata oluştu:', err);
                return res.status(500).json({ error: 'Veritabanı sorgu hatası.' });
            }

            if (rows.length > 0) {
                res.status(200).json({ [field.substring(1)]: rows[0][field.substring(1)] });
            } else {
                res.status(404).json({ error: 'Veri bulunamadı.' });
            }
        });
    });
});

module.exports = router;

