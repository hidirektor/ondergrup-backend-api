const { createActionLog } = require('../helpers/logger/actionLog');
const Users = require('../models/User');

const actionLogMiddleware = (operationType, operationName) => {
    return async (req, res, next) => {
        try {
            const {
                operationPlatform = null,
                sourceUserID = null,
                affectedUserID = null,
                affectedUserName = null,
                affectedMachineID = null,
                affectedMaintenanceID = null,
                affectedHydraulicUnitID = null
            } = req.body;

            let affectedUser = null,
                affectedUserIDData = null,
                sourceUser = null,
                affectedNameSurnameData = null,
                affectedUserNameData = null,
                sourceNameSurnameData = null;

            if (sourceUserID && sourceUserID.trim() !== '') {
                sourceUser = await Users.findOne({ where: { userID: sourceUserID }});
                if (sourceUser) {
                    sourceNameSurnameData = sourceUser.nameSurname;
                }
            }

            if (affectedUserID && affectedUserID.trim() !== '') {
                affectedUserIDData = affectedUserID;
                affectedUser = await Users.findOne({ where: { userID: affectedUserID } });
                if (affectedUser) {
                    affectedNameSurnameData = affectedUser.nameSurname;
                    affectedUserNameData = affectedUser.userName;
                }
            } else if (affectedUserName && affectedUserName.trim() !== '') {
                affectedUser = await Users.findOne({ where: { userName: affectedUserName } });
                if (affectedUser) {
                    affectedUserIDData = affectedUser.userID;
                }
            }

            const actionLogData = {
                sourceUserID: sourceUserID || null,
                sourceNameSurname: sourceNameSurnameData || null,
                affectedUserID: affectedUserIDData || null,
                affectedUserName: affectedUserNameData || null,
                affectedNameSurname: affectedNameSurnameData || null,
                affectedMachineID: affectedMachineID && affectedMachineID.trim() !== '' ? affectedMachineID : null,
                affectedMaintenanceID: affectedMaintenanceID && affectedMaintenanceID.trim() !== '' ? affectedMaintenanceID : null,
                affectedHydraulicUnitID: affectedHydraulicUnitID && affectedHydraulicUnitID.trim() !== '' ? affectedHydraulicUnitID : null,
                operationPlatform: operationPlatform,
                operationType: operationType,
                operationName: operationName,
                operationTime: Math.floor(Date.now() / 1000)
            };

            await createActionLog(actionLogData);

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Action Log cannot be created.' });
        }
    };
};

module.exports = actionLogMiddleware;