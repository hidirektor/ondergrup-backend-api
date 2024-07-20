const HydraulicUnit = require('../../models/HydraulicUnit');

const getCustomHydraulicInfo = async (req, res, next) => {
    const { UnitType } = req.body;
    try {

        let hydraulicInfoResult;

        if(!UnitType) {
            hydraulicInfoResult = await HydraulicUnit.findAll({
                where: {
                    hydraulicType: UnitType
                }
                //attributes: ['id', 'userID', 'userName', 'orderID', 'partListID', 'schematicID', 'hydraulicType', 'createdDate']
            });
        } else {
            hydraulicInfoResult = await HydraulicUnit.findAll({
                //attributes: ['id', 'userID', 'userName', 'orderID', 'partListID', 'schematicID', 'hydraulicType', 'createdDate']
            });
        }

        if(!hydraulicInfoResult || hydraulicInfoResult.length === 0) {
            return res.status(400).json({ message: 'No hydraulic unit data found' });
        }

        return res.status(200).json(hydraulicInfoResult);

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getCustomHydraulicInfo;