const jwt = require("jsonwebtoken");
const mysql = require('mysql2');
const dotenv = require('dotenv');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const path = require("path");
const CryptoJS = require('crypto-js');

dotenv.config();

const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const decryptPassword = (encryptedPassword) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.SECRET_KEY);
    const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword;
};

function generateNumericOTP(length) {
    const chars = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        otp += chars[randomIndex];
    }

    return otp;
}

module.exports = {
    createUser: async (req, res, next) => {
        const { Role, UserName, Email, Password, NameSurname, Phone, CompanyName, Created_At } = req.body;

        const pass = CryptoJS.AES.encrypt(Password, process.env.SECRET_KEY).toString();

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
                        [Role, UserName, Email, pass, NameSurname, Phone, Profile_Photo, CompanyName, Created_At],
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
    },


    loginUser: async (req, res, next)=> {
        const { Username, Password } = req.body;

        try {
            connectionPool.query(
                'SELECT * FROM Users WHERE UserName = ?',
                [Username],
                (error, results) => {
                    if (error) {
                        console.error('MySQL sorgu hatası:', error);
                        return res.status(500).json({ error: 'Sunucu hatası' });
                    }

                    if (results.length > 0) {
                        const user = results[0];
                        const encryptedPasswordInDB = user.Password;

                        const decryptedPasswordInDB = decryptPassword(encryptedPasswordInDB);

                        if (Password === decryptedPasswordInDB) {
                            return res.status(200).json({ message: 'Giriş başarılı' });
                        } else {
                            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
                        }
                    } else {
                        return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
                    }
                }
            );
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    directLoginUser: async (req, res, next)=> {
        const { Username, Password } = req.body;

        try {
            connectionPool.query(
                'SELECT * FROM Users WHERE UserName = ?',
                [Username],
                (error, results) => {
                    if (error) {
                        console.error('MySQL sorgu hatası:', error);
                        return res.status(500).json({ error: 'Sunucu hatası' });
                    }

                    if (results.length > 0) {
                        const user = results[0];
                        const encryptedPasswordInDB = user.Password;

                        if (decryptPassword(Password) === decryptPassword(encryptedPasswordInDB)) {
                            return res.status(200).json({ message: 'Giriş başarılı' });
                        } else {
                            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
                        }
                    } else {
                        return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
                    }
                }
            );
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    getPass: async (req, res, next) => {
        const { Password } = req.body;

        if (!Password) {
            return res.status(400).json({ error: 'Lütfen bir parola sağlayın.' });
        }

        const cipheredPass = CryptoJS.AES.encrypt(Password, process.env.SECRET_KEY).toString();

        try {
            const SECRET_KEY = process.env.SECRET_KEY;

            if (!SECRET_KEY) {
                return res.status(500).json({ error: 'Sunucu hatası: SECRET_KEY eksik.' });
            }

            if(cipheredPass != null) {
                return res.status(200).json({pass: cipheredPass});
            }
        } catch(err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    sendOTP: async (req, res, next)=> {
        const { Email } = req.body;

        try {
            //const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false, allowedChars: '0123456789' });
            const otpCode = generateNumericOTP(6);

            console.log(`OTP Kodu: ${otpCode} - Gönderilecek E-Posta: ${Email}`);

            const selectUserQuery = 'SELECT UserName FROM Users WHERE Email = ?';
            connectionPool.query(selectUserQuery, [Email], (error, userResults) => {
                if (error) {
                    console.error('Veritabanı hatası:', error);
                    return res.status(500).json({ error: 'Sunucu hatası' });
                }

                if (userResults.length === 0) {
                    return res.status(400).json({ error: 'Kullanıcı bulunamadı' });
                }

                const ownerUserName = userResults[0].UserName;

                const insertQuery = 'INSERT INTO Verification (otpType, otpCode, otpCreationDate, ownerUserName, otpReceiver) VALUES (?, ?, NOW(), ?, ?)';
                connectionPool.query(insertQuery, ['Email', otpCode, ownerUserName, Email], (error, results) => {
                    if (error) {
                        console.error('Veritabanı hatası:', error);
                        return res.status(500).json({ error: 'Sunucu hatası' });
                    }

                    const userDirectory = path.join(__basedir, 'icons', 'ondergrupMain.png');

                    const emailTemplate = `
                    <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
                        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                            <div style="border-bottom: 1px solid #eee">
                                <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">
                                    <img src="cid:ondergrupMain" alt="Önder Grup" style="display: block; margin: 0 auto; width: 230px; height: 150px" />
                                </a>
                            </div>
                            <p style="font-size: 1.1em">Merhabalar,</p>
                            <p>Önder Grup Tasarım Merkezi'ni seçtiğiniz için teşekkür ederiz. Aşağıdaki tek seferlik kodu kullanarak şifrenizi sıfırlayabilirsiniz. Unutmayın bu kod yalnızca <strong style="font-size: 18px">1 dakika</strong> boyunca geçerlidir!</p>
                            <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">
                                ${otpCode}
                            </h2>
                            <p style="font-size: 0.9em;">Saygılarımızla,<br/>Önder Grup Tasarım Merkezi</p>
                            <hr style="border: none; border-top: 1px solid #eee" />
                            <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
                                <p><a href="https://ondergrup.com">Önder Lift Çelik Mak. San. Tic. Ltd. Şti.</a></p>
                                <p><a href="https://www.google.com/maps/place/%C3%96nder+Lift+%C3%87elik+Mak.+San.+Tic.+Ltd.+%C5%9Eti./@38.4851028,27.6519011,15z/data=!4m2!3m1!1s0x0:0x8f19e57eecad8dea?sa=X&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhKEAA&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhNEAg">1. O.S.B., Organize Sanayi Bölgesi, 2004. Sokak No:4, 45410</a></p>
                                <p><a href="https://www.google.com/maps/place/%C3%96nder+Lift+%C3%87elik+Mak.+San.+Tic.+Ltd.+%C5%9Eti./@38.4851028,27.6519011,15z/data=!4m2!3m1!1s0x0:0x8f19e57eecad8dea?sa=X&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhKEAA&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhNEAg">Turgutlu Manisa / Turkey</a></p>
                            </div>
                        </div>
                    </div>`;

                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: Email,
                        subject: 'Doğrulama Kodunuz !',
                        html: emailTemplate,
                        attachments: [{
                            filename: 'ondergrupMain.png',
                            path: "https://i.hizliresim.com/i3ge8yy.png",
                            cid: 'ondergrupMain'
                        }]
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('E-posta gönderme hatası:', error);
                            return res.status(500).json({ error: 'E-posta gönderme hatası' });
                        }

                        console.log('E-posta gönderildi:', info.response);
                        res.status(200).json({ message: 'E-posta gönderildi', otpCode: otpCode });
                    });
                });
            });
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    }
}

