const UserModel = require('../models/UserSchema');

async function register(req, res) {
    const { UserType, UserName, Password, NameSurname, Email, CompanyName, Phone, ProfilePhoto } = req.body;

    try {
        const existingUser = await UserModel.findOne({ UserName });

        if (existingUser) {
            return res.sendResponse(400, { error: 'Bu kullanıcı adı zaten kullanılıyor' });
        }

        await UserModel.create({
            UserType,
            UserName,
            Password,
            NameSurname,
            Email,
            CompanyName,
            Phone,
            ProfilePhoto,
        });

        res.sendResponse(200, { message: 'Kullanıcı başarıyla eklendi' });
    } catch (err) {
        console.error('Sorgu hatası:', err);
        res.sendResponse(500, { error: 'Sunucu hatası' });
    }
}

module.exports = register;
