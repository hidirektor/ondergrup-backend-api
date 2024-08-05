const Maintenance = require('../../../models/Maintenance');
const ActionLog = require("../../../models/ActionLog");

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
 *               - maintenanceID
 *             properties:
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
        const { maintenanceID } = req.body;

        if (!maintenanceID) {
            return res.status(400).json({ message: 'maintenanceID is required' });
        }

        const maintenance = await Maintenance.findOne({ where: { id: maintenanceID } });
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        await maintenance.destroy();

        res.json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
