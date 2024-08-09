const Versions = require('../../../models/Version');

/**
 * @swagger
 * /getAllVersions:
 *   get:
 *     summary: Retrieve all machine software versions
 *     tags: [Authorized]
 *     responses:
 *       200:
 *         description: A list of all machine software versions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all machine software versions.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     versions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Version'
 *       404:
 *         description: No any machine software versions found on database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No any machine software versions found on database.
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
        const versions = await Versions.findAll();
        if (!versions.length) {
            return res.status(404).json({ message: 'No any machine software versions found on database.' });
        }

        res.status(200).json({ message: 'Successfully retrieved all machine software versions.', payload: { versions } });
    } catch (error) {
        console.log('Error retrieving all machine software versions.', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};