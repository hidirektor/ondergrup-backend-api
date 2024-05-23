const Users = require('../models/User');
const SubUsers = require('../models/SubUser');
const UserPreferences = require('../models/UserPreferences');
const RefreshTokens = require('../models/RefreshToken');
const Machines = require('../models/Machine');
const MachineData = require('../models/MachineData');
const Maintenances = require('../models/Maintenance');
const MachineErrors = require('../models/MachineError');
const OTPLog = require('../models/OTPLog');

// Users.userID > SubUsers.userID
Users.hasOne(SubUsers, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
SubUsers.belongsTo(Users, { foreignKey: 'userID', targetKey: 'userID' });

// Users.userID > SubUsers.ownerID
Users.hasOne(SubUsers, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
SubUsers.belongsTo(Users, { foreignKey: 'ownerID', targetKey: 'userID' });

// Users.userID > Machines.ownerID
Users.hasOne(Machines, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Machines.belongsTo(Users, { foreignKey: 'ownerID', targetKey: 'userID' });

// Users.userID > RefreshTokens.userID
Users.hasOne(RefreshTokens, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
RefreshTokens.belongsTo(Users, { foreignKey: 'userID', targetKey: 'userID' });

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
Users.hasOne(UserPreferences, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
UserPreferences.belongsTo(Users, { foreignKey: 'userID', targetKey: 'userID' });

// Users.userID > Maintenances.userID
Users.hasOne(Maintenances, { foreignKey: 'technicianID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Maintenances.belongsTo(Users, { foreignKey: 'technicianID', targetKey: 'userID' });

// Machines.machineID > Maintenances.machineID
Users.hasOne(Maintenances, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Maintenances.belongsTo(Users, { foreignKey: 'machineID', targetKey: 'machineID' });