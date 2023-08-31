const express = require('express');
const router = express.Router();
const HidrolikModel = require('../models/HidrolikSchema');

router.post('/:field', async (req, res) => {
    const field = req.params.field;
    const value = req.body[field];

    try {
        const hidrolik = await HidrolikModel.findOne({ OrderNumber: req.body.OrderNumber });
        if (hidrolik) {
            res.status(200).json({ [field.substring(1)]: hidrolik[field.substring(1)] });
        } else {
            res.status(404).json({ error: 'Veri bulunamadı.' });
        }
    } catch (err) {
        console.error('Hidrolik bilgisi alınırken bir hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;