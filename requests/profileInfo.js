const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserSchema');

router.post('/:field', async (req, res) => {
    const field = req.params.field;
    const value = req.body[field];

    try {
        const user = await UserModel.findOne({ UserName: req.body.Username });
        if (user) {
            res.status(200).json({ [field.substring(1)]: user[field.substring(1)] });
        } else {
            res.status(404).json({ error: 'Veri bulunamadı.' });
        }
    } catch (err) {
        console.error('Profil bilgisi alınırken bir hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;
