const Maintenance = require('../../../models/Maintenance');
const Users = require("../../../models/User");

/**
 * @swagger
 * /getAllMaintenances:
 *   get:
 *     summary: Retrieve all maintenances
 *     tags: [Authorized]
 *     responses:
 *       200:
 *         description: A list of all maintenances
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
 *                     machines:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: No maintenance found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No any maintenance found on database.
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
        const maintenances = await Maintenance.findAll();
        if (!maintenances.length) {
            return res.status(404).json({ message: 'No any maintenance found on database.' });
        }

        res.status(200).json({ message: 'Successfully retrieved all maintenances.', payload: { maintenances } });
    } catch (error) {
        console.log('Error retrieving all maintenances', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};