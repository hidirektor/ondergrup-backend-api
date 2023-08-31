const HidrolikModel = require('../models/HidrolikSchema');

async function orderNumbers(req, res) {
    try {
        const allOrderNumbers = await HidrolikModel.find({}, 'OrderNumber');

        const orderNumbers = allOrderNumbers.map((order) => order.OrderNumber.trim());

        res.json(orderNumbers);
    } catch (err) {
        console.error('Sorgu hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
}

module.exports = orderNumbers;