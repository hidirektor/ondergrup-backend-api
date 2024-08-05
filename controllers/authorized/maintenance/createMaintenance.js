const Maintenance = require('../../../models/Maintenance');
const Users = require("../../../models/User");
const ActionLog = require("../../../models/ActionLog");

/**
 * @swagger
 * /createMaintenance:
 *   post:
 *     summary: Create a new maintenance record
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machineID
 *               - technicianID
 *             properties:
 *               machineID:
 *                 type: integer
 *                 description: ID of the machine being maintained
 *                 example: 1
 *               technicianID:
 *                 type: integer
 *                 description: ID of the technician performing the maintenance
 *                 example: 2
 *               kontrol11:
 *                 type: integer
 *                 description: Status of kontrol 11
 *                 example: 1
 *               kontrol12:
 *                 type: integer
 *                 description: Status of kontrol 12
 *                 example: 1
 *               kontrol13:
 *                 type: integer
 *                 description: Status of kontrol 13
 *                 example: 1
 *               kontrol14:
 *                 type: integer
 *                 description: Status of kontrol 14
 *                 example: 1
 *               kontrol21:
 *                 type: integer
 *                 description: Status of kontrol 21
 *                 example: 1
 *               kontrol22:
 *                 type: integer
 *                 description: Status of kontrol 22
 *                 example: 1
 *               kontrol23:
 *                 type: integer
 *                 description: Status of kontrol 23
 *                 example: 1
 *               kontrol24:
 *                 type: integer
 *                 description: Status of kontrol 24
 *                 example: 1
 *               kontrol31:
 *                 type: integer
 *                 description: Status of kontrol 31
 *                 example: 1
 *               kontrol32:
 *                 type: integer
 *                 description: Status of kontrol 32
 *                 example: 1
 *               kontrol33:
 *                 type: integer
 *                 description: Status of kontrol 33
 *                 example: 1
 *               kontrol34:
 *                 type: integer
 *                 description: Status of kontrol 34
 *                 example: 1
 *               kontrol35:
 *                 type: integer
 *                 description: Status of kontrol 35
 *                 example: 1
 *               kontrol36:
 *                 type: integer
 *                 description: Status of kontrol 36
 *                 example: 0
 *               kontrol41:
 *                 type: integer
 *                 description: Status of kontrol 41
 *                 example: 0
 *               kontrol42:
 *                 type: integer
 *                 description: Status of kontrol 42
 *                 example: 0
 *               kontrol43:
 *                 type: integer
 *                 description: Status of kontrol 43
 *                 example: 0
 *               kontrol44:
 *                 type: integer
 *                 description: Status of kontrol 44
 *                 example: 0
 *               kontrol45:
 *                 type: integer
 *                 description: Status of kontrol 45
 *                 example: 0
 *               kontrol46:
 *                 type: integer
 *                 description: Status of kontrol 46
 *                 example: 0
 *               kontrol51:
 *                 type: integer
 *                 description: Status of kontrol 51
 *                 example: 0
 *               kontrol52:
 *                 type: integer
 *                 description: Status of kontrol 52
 *                 example: 0
 *               kontrol53:
 *                 type: integer
 *                 description: Status of kontrol 53
 *                 example: 0
 *               kontrol54:
 *                 type: integer
 *                 description: Status of kontrol 54
 *                 example: 0
 *               kontrol55:
 *                 type: integer
 *                 description: Status of kontrol 55
 *                 example: 0
 *               kontrol56:
 *                 type: integer
 *                 description: Status of kontrol 56
 *                 example: 0
 *               kontrol61:
 *                 type: integer
 *                 description: Status of kontrol 61
 *                 example: 0
 *               kontrol62:
 *                 type: integer
 *                 description: Status of kontrol 62
 *                 example: 0
 *               kontrol63:
 *                 type: integer
 *                 description: Status of kontrol 63
 *                 example: 0
 *               kontrol71:
 *                 type: integer
 *                 description: Status of kontrol 71
 *                 example: 0
 *               kontrol72:
 *                 type: integer
 *                 description: Status of kontrol 72
 *                 example: 0
 *               kontrol81:
 *                 type: integer
 *                 description: Status of kontrol 81
 *                 example: 0
 *               kontrol82:
 *                 type: integer
 *                 description: Status of kontrol 82
 *                 example: 0
 *               kontrol83:
 *                 type: integer
 *                 description: Status of kontrol 83
 *                 example: 0
 *               kontrol91:
 *                 type: integer
 *                 description: Status of kontrol 91
 *                 example: 0
 *               kontrol92:
 *                 type: integer
 *                 description: Status of kontrol 92
 *                 example: 0
 *               kontrol93:
 *                 type: integer
 *                 description: Status of kontrol 93
 *                 example: 0
 *               kontrol94:
 *                 type: integer
 *                 description: Status of kontrol 94
 *                 example: 0
 *               kontrol95:
 *                 type: integer
 *                 description: Status of kontrol 95
 *                 example: 0
 *               kontrol96:
 *                 type: integer
 *                 description: Status of kontrol 96
 *                 example: 0
 *               kontrol97:
 *                 type: integer
 *                 description: Status of kontrol 97
 *                 example: 0
 *               kontrol98:
 *                 type: integer
 *                 description: Status of kontrol 98
 *                 example: 0
 *               kontrol99:
 *                 type: integer
 *                 description: Status of kontrol 99
 *                 example: 0
 *               kontrol910:
 *                 type: integer
 *                 description: Status of kontrol 910
 *                 example: 0
 *     responses:
 *       201:
 *         description: Maintenance record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Maintenance record created successfully.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     maintenance:
 *                       $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: All fields are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

module.exports = async (req, res) => {
    try {
        const { machineID, technicianID, ...updateData } = req.body;

        if (!machineID || !technicianID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const technician = Users.findOne({ where: { userID: technicianID } });

        const maintenance = await Maintenance.create({
            machineID,
            technicianID,
            maintenanceDate: Math.floor(Date.now() / 1000),
            ...updateData
        });

        res.status(201).json({ message: 'Maintenance record created successfully.', payload: { maintenance } });
    } catch (error) {
        console.error('Error creating maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};