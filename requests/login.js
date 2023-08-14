const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const connectionPool = mysql.createPool({
    host: process.env.NODE_SERVERNAME,
    user: process.env.NODE_USERNAME,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    connectionLimit: 10
});

async function login(req, res) {
    const { Username, Password } = req.body;

    try {
        connectionPool.query(
            'SELECT * FROM Users WHERE username = ? AND password = ?',
            [Username, Password],
            (error, results) => {
                if (error) {
                    console.error('MySQL sorgu hatası:', error);
                    return res.status(500).json({ error: 'Sunucu hatası' });
                }

                if (results.length > 0) {
                    return res.status(200).json({ message: 'Giriş başarılı' });
                } else {
                    return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
                }
            }
        );
    } catch (err) {
        console.error('Sorgu hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
}

module.exports = login;
