const mysql = require('mysql2');
const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

async function updatePass(req, res) {
    const { Email, Password } = req.body;

    try {
        connectionPool.getConnection(function(err, connection) {
            if (err) {
                console.error('Veritabanı bağlantısı hatası:', err);
                return res.status(500).json({ error: 'Veritabanı bağlantısı hatası' });
            }

            const findUserQuery = `SELECT * FROM Users WHERE Email = ?`;
            connection.query(findUserQuery, [Email], function(err, results) {
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
                if (user.Password === Password) {
                    connection.release();
                    return res.status(400).json({ error: 'Eski şifre ile yeni şifre aynı olamaz' });
                }

                const updatePassQuery = `UPDATE Users SET Password = ? WHERE Email = ?`;
                connection.query(updatePassQuery, [Password, Email], function(err, updateResult) {
                    connection.release();

                    if (err) {
                        console.error('Güncelleme hatası:', err);
                        return res.status(500).json({ error: 'Sunucu hatası' });
                    }

                    res.status(200).json({ message: 'Şifre güncellendi' });
                });
            });
        });
    } catch (err) {
        console.error('İşlem hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
}

module.exports = updatePass;
