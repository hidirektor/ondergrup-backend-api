const { createActionLog } = require('../helpers/logger/actionLog');
const Users = require('../models/User');

const actionLogMiddleware = (operationType, operationName) => {
    return async (req, res, next) => {
        try {
            const { operationPlatform, sourceUserID, affectedUserID, affectedUserName, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID } = req.body;

            let affectedUser = null, affectedUserIDData = null,  sourceUser = null, affectedNameSurnameData = null, affectedUserNameData = null, sourceNameSurnameData = null;

            if(sourceUserID && !sourceUserID.isEmpty()) {
                sourceUser = await Users.findOne({ where: { userID: sourceUserID }});
                if(sourceUser) {
                    sourceNameSurnameData = sourceUser.nameSurname;
                }
            }

            if(affectedUserID && !affectedUserID.isEmpty()) {
                affectedUserIDData = affectedUserID;
                affectedUser = await Users.findOne({ where: { userID: affectedUserID } });
                if(affectedUser) {
                    affectedNameSurnameData = affectedUser.nameSurname;
                }
            } else {
                if(affectedUserName && !affectedUserName.isEmpty()) {
                    affectedUser = await Users.findOne({ where: { userName: affectedUserName } });
                    if(affectedUser) {
                        affectedUserIDData = affectedUser.userID;
                    }
                }
            }

            await createActionLog({
                sourceUserID: sourceUserID,
                sourceNameSurname: sourceNameSurnameData,
                affectedUserID: affectedUserIDData,
                affectedUserName: affectedNameSurnameData,
                affectedNameSurname: affectedNameSurnameData,
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