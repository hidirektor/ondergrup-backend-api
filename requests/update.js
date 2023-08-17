const mysql = require('mysql');
const connectionPool = mysql.createPool({
    host: process.env.NODE_SERVERNAME,
    user: process.env.NODE_USERNAME,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    connectionLimit: 10
});

async function register(req, res) {
    const { UserName, Email, Password, NameSurname, Phone, CompanyName, Created_At } = req.body;

    try {
        connectionPool.query(
            'SELECT * FROM Users WHERE UserName = ?',
            [UserName],
            async (error, results) => {
                if (error) {
                    console.error('MySQL sorgu hatası:', error);
                    return res.status(500).json({ error: 'Sunucu hatası' });
                }

                if (results.length <= 0) {
                    return res.status(400).json({ error: 'Böyle bir kullanıcı bulunamadı' });
                }

                const Profile_Photo = 'C:/Users/hidir/WebstormProjects/OnderGrupServerSide/data/profilePhoto/${UserName}.jpg';

                connectionPool.query(
                    'UPDATE Users SET UserName = ?, Email = ?, Password = ?, NameSurname = ?, Phone = ?, Profile_Photo = ?, CompanyName = ?, Created_At = ? WHERE UserName = ?',
                    [UserName, Email, Password, NameSurname, Phone, Profile_Photo, CompanyName, Created_At, UserName],
                    async (updateError, updateResults) => {
                        if (updateError) {
                            console.error('MySQL sorgu hatası:', updateError);
                            return res.status(500).json({ error: 'Sunucu hatası' });
                        }

                        return res.status(200).json({ message: 'Kullanıcı güncellendi' });
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