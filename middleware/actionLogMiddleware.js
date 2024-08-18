const { createActionLog } = require('../helpers/logger/actionLog');
const { Users } = require('../models/User');

const actionLogMiddleware = (operationType, operationName) => {
    return async (req, res, next) => {
        try {
            const { sourceUserID, affectedUserID, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID, operationSection } = req.body;

            let affectedUser, affectedUserNameData;

            if(affectedUserID) {
                affectedUser = await Users.findOne({ where: { userID: affectedUserID } });
                if(affectedUser) {
                    affectedUserNameData = affectedUser.nameSurname;
                }
            }

            await createActionLog({
                sourceUserID: sourceUserID,
                affectedUserID: affectedUserID,
                affectedUserName: affectedUserNameData,
                affectedMachineID: affectedMachineID,
                affectedMaintenanceID: affectedMaintenanceID,
                affectedHydraulicUnitID: affectedHydraulicUnitID,
                operationSection,
                operationType,
                operationName,
            });

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Action Log can not be created.' });
        }
    };
};

module.exports = actionLogMiddleware;