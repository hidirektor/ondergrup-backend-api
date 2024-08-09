const Maintenance = require('../../../models/Maintenance');
const {createActionLog} = require("../../../helpers/logger/actionLog");

/**
 * @swagger
 * /deleteMaintenance:
 *   delete:
 *     summary: Delete a maintenance record by ID
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - maintenanceID
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID of source user.
 *               maintenanceID:
 *                 type: integer
 *                 description: ID of the maintenance record to delete
 *                 example: 1
 *     responses:
 *       200:
 *         description: Maintenance record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Maintenance record deleted successfully
 *       400:
 *         description: MaintenanceID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: maintenanceID is required
 *       404:
 *         description: Maintenance record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Maintenance record not found
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
        const { userID, maintenanceID } = req.body;

        if (!maintenanceID) {
            return res.status(400).json({ message: 'maintenanceID is required' });
        }

        const maintenance = await Maintenance.findOne({ where: { id: maintenanceID } });
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        try {
            await createActionLog({
                sourceUserID: userID,
                affectedUserID: null,
                affectedUserName: null,
                affectedMachineID: null,
                affectedMaintenanceID: maintenanceID,
                affectedHydraulicUnitID: null,
                operationSection: 'EMBEDDED',
                operationType: 'DELETE',
                operationName: 'Maintenance Deleted.',
            });
        } catch (error) {
            res.status(500).json({ message: 'Action Log can not created.' });
        }

        await maintenance.destroy();

        res.json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
