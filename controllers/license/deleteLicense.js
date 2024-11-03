const License = require('../../models/License');
const LicenseRecords = require('../../models/LicenseRecords');

/**
 * @swagger
 * /license/remove:
 *   delete:
 *     summary: Remove a license
 *     tags: [License]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseID
 *             properties:
 *               licenseID:
 *                 type: string
 *     responses:
 *       200:
 *         description: License removed successfully
 *       404:
 *         description: License not found
 *       500:
 *         description: Unexpected error
 */

module.exports = async (req, res) => {
    const { licenseID } = req.body;

    try {
        const license = await License.findOne({ where: { licenseID } });

        if (!license) {
            return res.status(404).json({ message: 'License not found' });
        }

        await License.destroy({ where: { licenseID } });

        await LicenseRecords.destroy({ where: { licenseID } });

        res.json({ message: 'License removed successfully' });
    } catch (error) {
        console.error('Error removing license:', error);
        res.status(500).json({ message: 'Unexpected error during license removal' });
    }
};