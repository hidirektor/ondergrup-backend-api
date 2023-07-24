const UserModel = require('../models/UserSchema');

async function login(req, res) {
    const { Username, Password } = req.body;

    try {
        const user = await UserModel.findOne({ UserName: Username, Password: Password });
        if (user) {
            res.sendResponse(200, { message: 'Giriş başarılı' });
        } else {
            res.sendResponse(401, { error: 'Geçersiz kullanıcı adı veya şifre' });
        }
    } catch (err) {
        console.error('Sorgu hatası:', err);
        res.sendResponse(500, { error: 'Sunucu hatası' });
    }
}

module.exports = login;
