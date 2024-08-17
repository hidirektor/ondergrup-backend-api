const { createActionLog } = require('../helpers/logger/actionLog');

const actionLogMiddleware = (operationSection, operationType, operationName) => {
    return async (req, res, next) => {
        try {
            const { userID, userName } = req.body;

            await createActionLog({
                sourceUserID: userID,
                affectedUserID: null,
                affectedUserName: userName,
                affectedMachineID: null,
                affectedMaintenanceID: null,
                affectedHydraulicUnitID: null,
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