const { createActionLog } = require('../helpers/logger/actionLog');
const Users = require('../models/User');

const actionLogMiddleware = (operationType, operationName) => {
    return async (req, res, next) => {
        try {
            const { operationPlatform, sourceUserID, affectedUserID, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID } = req.body;

            let affectedUser = null, sourceUser = null, affectedNameSurnameData = null, sourceNameSurnameData = null;

            if(sourceUserID) {
                sourceUser = await Users.findOne({ where: { userID: sourceUserID }});
                if(sourceUser) {
                    sourceNameSurnameData = sourceUser.nameSurname;
                }
            }

            if(affectedUserID) {
                affectedUser = await Users.findOne({ where: { userID: affectedUserID } });
                if(affectedUser) {
                    affectedNameSurnameData = affectedUser.nameSurname;
                }
            }

            await createActionLog({
                sourceUserID: sourceUserID,
                sourceNameSurname: sourceNameSurnameData,
                affectedUserID: affectedUserID,
                affectedUserName: affectedNameSurnameData,
                affectedMachineID: affectedMachineID,
                affectedMaintenanceID: affectedMaintenanceID,
                affectedHydraulicUnitID: affectedHydraulicUnitID,
                operationPlatform,
                operationType,
                operationName,
            });

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Action Log can not be created.' });
        }
    };
};

module.exports = actionLogMiddleware;