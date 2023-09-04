const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

const secretKey = process.env.SECRET_KEY;

module.exports = {
    profileInfo: async (req, res, next) => {
        const field = req.params.field;
        const value = req.body[field];

        connectionPool.getConnection((err, connection) => {
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
    },

    getWholeProfileInfo: async (req, res, next) => {
        const { username } = req.body;
        try {
            const [roleResult] = await connectionPool.promise().query(
                'SELECT Role as selectedRole FROM Users WHERE UserName = ?', [username]
            );

            const [nameSurnameResult] = await connectionPool.promise().query(
                'SELECT NameSurname as selectedNameSurname FROM Users WHERE UserName = ?', [username]
            );

            const [usernameResult] = await connectionPool.promise().query(
                'SELECT UserName as selectedUserName FROM Users WHERE UserName = ?', [username]
            );

            const [emailResult] = await connectionPool.promise().query(
                'SELECT Email as selectedEmail FROM Users WHERE UserName = ?', [username]
            );

            const [phoneResult] = await connectionPool.promise().query(
                'SELECT Phone as selectedPhone FROM Users WHERE UserName = ?', [username]
            );

            const [companyNameResult] = await connectionPool.promise().query(
                'SELECT CompanyName as selectedCompanyName FROM Users WHERE UserName = ?', [username]
            );

            const profileData = {
                "Role": roleResult[0].selectedRole,
                "NameSurname": nameSurnameResult[0].selectedNameSurname,
                "UserName": usernameResult[0].selectedUserName,
                "Email": emailResult[0].selectedEmail,
                "Phone": phoneResult[0].selectedPhone,
                "CompanyName": companyNameResult[0].selectedCompanyName
            };

            return res.status(200).json(profileData);

        } catch (error) {
            console.error('MySQL sorgu hatası:', error);
            return res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    updateProfile: async (req, res, next) => {
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

                    const Profile_Photo = `C:/Server Side/data/profilePhoto/${UserName}.jpg`;

                    let updateQuery, updateValues;

                    if (Password !== 'null') {
                        updateQuery = `
                    UPDATE Users
                    SET UserName = ?, Email = ?, Password = ?, NameSurname = ?, Phone = ?, Profile_Photo = ?, CompanyName = ?, Created_At = ?
                    WHERE UserName = ?`;
                        updateValues = [UserName, Email, Password, NameSurname, Phone, Profile_Photo, CompanyName, Created_At, UserName];
                    } else {
                        updateQuery = `
                    UPDATE Users
                    SET UserName = ?, Email = ?, NameSurname = ?, Phone = ?, Profile_Photo = ?, CompanyName = ?, Created_At = ?
                    WHERE UserName = ?`;
                        updateValues = [UserName, Email, NameSurname, Phone, Profile_Photo, CompanyName, Created_At, UserName];
                    }

                    connectionPool.query(updateQuery, updateValues, async (updateError, updateResults) => {
                        if (updateError) {
                            console.error('MySQL sorgu hatası:', updateError);
                            return res.status(500).json({ error: 'Sunucu hatası' });
                        }

                        return res.status(200).json({ message: 'Profil güncellendi' });
                    });
                }
            );
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    updatePass: async (req, res, next) => {
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
}
