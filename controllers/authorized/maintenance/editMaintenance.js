const Maintenance = require('../../../models/Maintenance');

/**
 * @swagger
 * /editMaintenance:
 *   put:
 *     summary: Update a maintenance record by ID
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
 *                 description: ID of the maintenance record to update
 *                 example: 1
 *               machineID:
 *                 type: integer
 *                 description: ID of the machine being maintained
 *                 example: 2
 *               technicianID:
 *                 type: integer
 *                 description: ID of the technician performing the maintenance
 *                 example: 3
 *               maintenanceDescription:
 *                 type: string
 *                 description: Description of the maintenance performed
 *                 example: "Replaced faulty wiring"
 *               maintenanceCost:
 *                 type: number
 *                 description: Cost of the maintenance
 *                 example: 150.00
 *     responses:
 *       200:
 *         description: Maintenance record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Maintenance record updated successfully.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     updatedMaintenance:
 *                       $ref: '#/components/schemas/Maintenance'
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
        const { userID, maintenanceID, ...updateData } = req.body;

        if (!maintenanceID) {
            return res.status(400).json({ message: 'maintenanceID is required' });
        }

        const [updated] = await Maintenance.update(updateData, {
            where: { id: maintenanceID }
        });

        if (updated) {
            const updatedMaintenance = await Maintenance.findOne({ where: { id: maintenanceID } });

            return res.status(200).json({ message: 'Maintenance record updated.', payload: { updatedMaintenance } });
        }

        throw new Error('Maintenance record not found');
    } catch (error) {
        console.error('Error updating maintenance record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};