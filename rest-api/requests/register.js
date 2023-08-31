const mysql = require('mysql2');
const path = require("path");
const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

async function register(req, res) {
    const { Role, UserName, Email, Password, NameSurname, Phone, CompanyName, Created_At } = req.body;

    try {
        connectionPool.query(
            'SELECT * FROM Users WHERE UserName = ?',
            [UserName],
            async (error, results) => {
                if (error) {
                    console.error('MySQL sorgu hatası:', error);
                    return res.status(500).json({ error: 'Sunucu hatası' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanılıyor' });
                }

                const Profile_Photo = path.join(__basedir, `/data/profilePhoto/${UserName}.jpg`);

                connectionPool.query(
                    'INSERT INTO Users (Role, UserName, Email, Password, NameSurname, Phone, Profile_Photo, CompanyName, Created_At) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [Role, UserName, Email, Password, NameSurname, Phone, Profile_Photo, CompanyName, Created_At],
                    async (insertError, insertResults) => {
                        if (insertError) {
                            console.error('MySQL sorgu hatası:', insertError);
                            return res.status(500).json({ error: 'Sunucu hatası' });
                        }

                        return res.status(200).json({ message: 'Kullanıcı eklendi' });
                    }
                );
            }
        );
    } catch (err) {
        console.error('Sorgu hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
}

module.exports = register;
