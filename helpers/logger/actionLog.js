const ActionLog = require('../../models/ActionLog');
const Users = require('../../models/User');

const createActionLog = async ({
                                   sourceUserID,
                                   sourceNameSurname,
                                   affectedUserID = null,
                                   affectedUserName = null,
                                   affectedNameSurname = null,
                                   affectedMachineID = null,
                                   affectedMaintenanceID = null,
                                   affectedHydraulicUnitID = null,
                                   operationPlatform,
                                   operationType,
                                   operationName,
                               }) => {
    try {
        const actionLogData = {
            sourceUserID: sourceUserID,
            sourceNameSurname: sourceNameSurname,
            affectedUserID: affectedUserID,
            affectedUserName: affectedUserName,
            affectedNameSurname: affectedNameSurname,
            affectedMachineID: affectedMachineID,
            affectedMaintenanceID: affectedMaintenanceID,
            affectedHydraulicUnitID: affectedHydraulicUnitID,
            operationPlatform: operationPlatform,
            operationType: operationType,
            operationName: operationName,
            operationTime: Math.floor(Date.now() / 1000)
        };

        const newActionLog = await ActionLog.create(actionLogData);

        return newActionLog;
    } catch (error) {
        console.error("Error creating ActionLog:", error);
        throw error;
    }
};

module.exports = {
    createActionLog,
};