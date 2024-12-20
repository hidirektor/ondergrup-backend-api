const Machine = require('../../models/Machine');
const MachineErrors = require('../../models/MachineError');

/**
 * @swagger
 * /getErrorsAll:
 *   post:
 *     summary: Retrieve all errors for all machines owned by a specific user
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
 *         description: A list of machine errors for the user's machines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all machine errors.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     errors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MachineError'
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
 *         description: No machines found for the user or No machine errors found for the machines
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
 *                   example: "No machine errors found for whole machines"
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

        const errors = await MachineErrors.findAll({
            where: {
                machineID: machineIDs
            }
        });

        if(!errors.length) {
            return res.status(404).json({ message: 'No machine errors found for whole machines' });
        }

        res.status(200).json({ message: 'Successfully retrieved all machine errors.', payload: { errors } });
    } catch (error) {
        console.log('Error retrieving all machine errors', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};