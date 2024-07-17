const HydraulicUnit = require('../../models/HydraulicUnit');

const getHydraulicInfo = async (req, res, next) => {
    try {
        const hydraulicInfoResult = await HydraulicUnit.findAll({
            attributes: ['id', 'userID', 'userName', 'orderID', 'createdDate', 'hydraulicType', 'pdfFile', 'excelFile', 'createdBy']
        });

        return res.status(200).json(hydraulicInfoResult);

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getHydraulicInfo;