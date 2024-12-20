const Machine = require('../../models/Machine');
const MachineMaintenances = require('../../models/Maintenance');
const User = require('../../models/User');

/**
 * @swagger
 * /getMaintenancesAll:
 *   post:
 *     summary: Retrieve all maintenances for all machines owned by a specific user
 *     tags: [Machine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "U1234"
 *     responses:
 *       200:
 *         description: A list of maintenances for the user's machines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all maintenances.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     maintenancesWithTechnicianNames:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "userID is required"
 *       404:
 *         description: No machines found for the user or No maintenance data found for the machines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No machines found for this user"
 *                 message2:
 *                   type: string
 *                   example: "Maintenance data not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

module.exports = async (req, res) => {
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ message: 'userID is required' });
        }

        const ownerID = userID;

        const machines = await Machine.findAll({ where: { ownerID } });
        if (!machines.length) {
            return res.status(404).json({ message: 'No machines found for this user' });
        }

        const machineIDs = machines.map(machine => machine.machineID);

        const maintenances = await MachineMaintenances.findAll({
            where: {
                machineID: machineIDs
            }
        });

        if (!maintenances || maintenances.length === 0) {
            return res.status(404).send('Maintenance data not found');
        }

        const maintenancesWithTechnicianNames = await Promise.all(maintenances.map(async (maintenance) => {
            const userID = maintenance.technicianID;
            const technician = await User.findOne({ where: { userID } });
            return {
                ...maintenance.toJSON(),
                technicianName: technician ? technician.userName : 'Unknown'
            };
        }));

        res.status(200).json({ message: 'Successfully retrieved all maintenances.', payload: { maintenancesWithTechnicianNames } });
    } catch (error) {
        console.log('Error retrieving all machine errors', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};