const HydraulicUnit = require('../../models/HydraulicUnit');

const getCustomHydraulicInfo = async (req, res, next) => {
    const { UnitType } = req.body;
    try {
        const hydraulicInfoResult = await HydraulicUnit.findAll({
            where: {
                hydraulicType: UnitType
            },
            attributes: ['id', 'userID', 'userName', 'orderID', 'createdDate', 'hydraulicType', 'pdfFile', 'excelFile', 'createdBy']
        });

        return res.status(200).json(hydraulicInfoResult);

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getCustomHydraulicInfo;