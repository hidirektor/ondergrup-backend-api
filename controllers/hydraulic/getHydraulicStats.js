const HydraulicUnit = require('../../models/HydraulicUnit');

const getHydraulicStats = async (req, res) => {
    try {
        const totalOrdersResult = await HydraulicUnit.count();

        const klasikCountResult = await HydraulicUnit.count({
            where: {
                hydraulicType: 'Klasik'
            }
        });

        const hidrosCountResult = await HydraulicUnit.count({
            where: {
                hydraulicType: 'Hidros'
            }
        });

        const statistics = {
            "Sipariş Sayısı": totalOrdersResult,
            "Klasik": klasikCountResult,
            "Hidros": hidrosCountResult
        };

        return res.status(200).json(statistics);

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getHydraulicStats;