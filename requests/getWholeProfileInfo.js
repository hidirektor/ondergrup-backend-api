const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connectionPool = mysql.createPool({
    host: process.env.NODE_SERVERNAME,
    user: process.env.NODE_USERNAME,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    connectionLimit: 10
});

async function getWholeProfile(req, res) {
    const { username } = req.body;
    try {
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
}

module.exports = getWholeProfile;
