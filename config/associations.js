const Users = require('../models/User');
const SubUsers = require('../models/SubUser');
const UserPreferences = require('../models/UserPreferences');
const Machines = require('../models/Machine');
const MachineData = require('../models/MachineData');
const Maintenances = require('../models/Maintenance');
const MachineErrors = require('../models/MachineError');
const OTPLog = require('../models/OTPLog');
const ActionLog = require('../models/ActionLog');
const Tickets = require('../models/SupportTicket');

// Users.userID > SubUsers.userID
Users.hasOne(SubUsers, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
SubUsers.belongsTo(Users, { foreignKey: 'userID', targetKey: 'userID' });

// Users.userID > SubUsers.ownerID
Users.hasOne(SubUsers, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
SubUsers.belongsTo(Users, { foreignKey: 'ownerID', targetKey: 'userID' });

// Users.userID > ActionLog.sourceUserID
Users.hasOne(ActionLog, { foreignKey: 'sourceUserID', sourceKey: 'userID', onUpdate: 'CASCADE' });
ActionLog.belongsTo(Users, { foreignKey: 'sourceUserID', targetKey: 'userID' });

// Users.userID > ActionLog.affectedUserID
Users.hasOne(ActionLog, { foreignKey: 'affectedUserID', sourceKey: 'userID', onUpdate: 'CASCADE' });
ActionLog.belongsTo(Users, { foreignKey: 'affectedUserID', targetKey: 'userID' });

// Users.userID > Machines.ownerID
Users.hasOne(Machines, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
Machines.belongsTo(Users, { foreignKey: 'ownerID', targetKey: 'userID' });

// Machines.machineID > MachineData.machineID
Machines.hasOne(MachineData, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
MachineData.belongsTo(Machines, { foreignKey: 'machineID', targetKey: 'machineID' });

// Machines.machineID > MachineErrors.machineID
Machines.hasOne(MachineErrors, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
MachineErrors.belongsTo(Machines, { foreignKey: 'machineID', targetKey: 'machineID' });

// Users.userID > OTPLog.userID
Users.hasOne(OTPLog, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
OTPLog.belongsTo(Users, { foreignKey: 'userID', targetKey: 'userID' });

// Users.userID > UserPreferences.userID
Users.hasOne(UserPreferences, { foreignKey: 'userID', sourceKey: 'userID', as: 'preferences', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
UserPreferences.belongsTo(Users, { foreignKey: 'userID', targetKey: 'userID', as: 'user' });

// Users.userID > Maintenances.userID
Users.hasOne(Maintenances, { foreignKey: 'technicianID', sourceKey: 'userID', onUpdate: 'CASCADE' });
Maintenances.belongsTo(Users, { foreignKey: 'technicianID', targetKey: 'userID' });

// Machines.machineID > Maintenances.machineID
Machines.hasOne(Maintenances, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Maintenances.belongsTo(Machines, { foreignKey: 'machineID', targetKey: 'machineID' });

// Machine.machineID > ActionLog.affectedMachineID
Machines.hasOne(ActionLog, { foreignKey: 'affectedMachineID', sourceKey: 'machineID', onUpdate: 'CASCADE' });
ActionLog.belongsTo(Machines, { foreignKey: 'affectedMachineID', targetKey: 'machineID' });

// Maintenances.id > ActionLog.affectedMaintenanceID
Maintenances.hasOne(ActionLog, { foreignKey: 'affectedMaintenanceID', sourceKey: 'id', onUpdate: 'CASCADE' });
ActionLog.belongsTo(Maintenances, { foreignKey: 'affectedMaintenanceID', targetKey: 'id' });

// Users.userID > Tickets.ownerID
Users.hasOne(Tickets, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE' });
Tickets.belongsTo(Users, { foreignKey: 'ownerID', targetKey: 'userID' });