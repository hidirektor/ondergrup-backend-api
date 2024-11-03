const License = require('../../models/License');
const LicenseRecords = require('../../models/LicenseRecords');

/**
 * @swagger
 * /license/activate:
 *   post:
 *     summary: Activate a license
 *     tags: [License]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseKey
 *               - deviceInfo
 *             properties:
 *               licenseKey:
 *                 type: string
 *               deviceInfo:
 *                 type: object
 *               activatedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: License activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'License activated successfully'
 *       400:
 *         description: Invalid license or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'License has expired'
 *       409:
 *         description: Device count exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Device count limit reached'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unexpected error during license activation'
 */

module.exports = async (req, res) => {
    const { licenseKey, deviceInfo, activatedBy } = req.body;

    try {
        const license = await License.findOne({ where: { licenseKey } });

        if (!license) {
            return res.status(400).json({ message: 'Invalid license key' });
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if(license.licenseExpiry !== "endless") {
            if (license.licenseExpiry < currentTime) {
                return res.status(400).json({ message: 'License has expired' });
            }
        }

        const recordCount = await LicenseRecords.count({ where: { licenseID: license.licenseID } });

        if (recordCount >= license.deviceCount) {
            return res.status(409).json({ message: 'Device count limit reached' });
        }

        const recordData = {
            licenseID: license.licenseID,
            deviceInfo: JSON.stringify(deviceInfo),
            activationTime: currentTime,
            activatedBy: activatedBy,
        };

        await LicenseRecords.create(recordData);

        return res.json({ message: 'License activated successfully' });
    } catch (error) {
        console.error('Error activating license:', error);
        res.status(500).json({ message: 'Unexpected error during license activation' });
    }
};