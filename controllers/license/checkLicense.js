const License = require('../../models/License');
const LicenseRecords = require('../../models/LicenseRecords');

/**
 * @swagger
 * /license/check:
 *   post:
 *     summary: Check a license
 *     tags: [License]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseKey
 *             properties:
 *               licenseKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: License is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'License is valid'
 *                 licenseID:
 *                   type: string
 *                   description: The ID of the license
 *       404:
 *         description: License not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'License not found'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unexpected error during license check'
 */

module.exports = async (req, res) => {
    const { licenseKey } = req.body;

    try {
        const license = await License.findOne({ where: { licenseKey } });

        if (!license) {
            return res.status(404).json({ message: 'License not found' });
        }

        const recordExists = await LicenseRecords.findOne({ where: { licenseID: license.licenseID } });

        if (recordExists) {
            return res.json({
                message: 'License is valid',
                payload: license,
            });
        } else {
            return res.status(404).json({ message: 'License not found in records' });
        }
    } catch (error) {
        console.error('Error checking license:', error);
        res.status(500).json({ message: 'Unexpected error during license check' });
    }
};