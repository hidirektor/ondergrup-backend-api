const Machine = require('../../models/Machine');

/**
 * @swagger
 * /getMachines:
 *   get:
 *     summary: Retrieve all machines owned by a specific user
 *     tags: [Machine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerID:
 *                 type: string
 *                 description: The ID of the owner
 *                 example: "O5678"
 *     responses:
 *       200:
 *         description: A list of machines owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 machines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Machine'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ownerID is required"
 *       404:
 *         description: No machines found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No machines found for this user"
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
        const { ownerID } = req.body;

        if (!ownerID) {
            return res.status(400).json({ message: 'ownerID is required' });
        }

        const machines = await Machine.findAll({ where: { ownerID } });

        if (!machines.length) {
            return res.status(404).json({ message: 'No machines found for this user' });
        }

        res.status(200).json({ machines });
    } catch (error) {
        console.error('Error retrieving machines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};