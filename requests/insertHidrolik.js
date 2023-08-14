const HidrolikModel = require('../models/HidrolikSchema');

async function insertHidrolik(req, res) {
    const { OrderNumber, OrderDate, Type, InCharge, PDF, PartList } = req.body;

    try {
        const existingHidrolik = await HidrolikModel.findOne({ OrderNumber });

        if (existingHidrolik) {
            return res.status(400).json({ error: 'Bu OrderNumber zaten kullanılıyor' });
        }

        await HidrolikModel.create({
            OrderNumber,
            OrderDate,
            Type,
            InCharge,
            PDF,
            PartList
        });

        res.status(200).json({ message: 'Hidrolik başarıyla eklendi' });
    } catch (err) {
        console.error('Sorgu hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
}

module.exports = insertHidrolik;