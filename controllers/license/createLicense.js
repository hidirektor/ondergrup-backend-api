const { v4: uuidv4 } = require('uuid');
const License = require('../../models/License');
const { encryptLicense } = require('../../helpers/licenseUtil');

/**
 * @swagger
 * /license/create:
 *   post:
 *     summary: Create a new license
 *     tags: [License]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseOwner
 *               - licenseEmail
 *               - licenseExpiry
 *               - licenseDeviceCount
 *             properties:
 *               licenseOwner:
 *                 type: string
 *               licenseEmail:
 *                 type: string
 *               licenseExpiry:
 *                 type: string
 *               licenseDeviceCount:
 *                 type: string
 *     responses:
 *       201:
 *         description: License created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Unexpected error
 */

module.exports = async (req, res) => {
    const { licenseOwner, licenseEmail, licenseExpiry, licenseDeviceCount } = req.body;

    try {
        let licenseID;
        let isUnique = false;

        while (!isUnique) {
            licenseID = uuidv4();

            const existingLicense = await License.findOne({ where: { licenseID } });
            isUnique = !existingLicense;
        }

        let expiryTimestamp;
        if (licenseExpiry !== "endless") {
            expiryTimestamp = Math.floor(new Date(licenseExpiry).getTime() / 1000);
        }

        const encryptedLicenseData = encryptLicense({
            licenseOwner,
            licenseEmail,
            licenseExpiry: expiryTimestamp || licenseExpiry,
            licenseDeviceCount
        });

        const operationTime = Math.floor(Date.now() / 1000);

        const newLicense = await License.create({
            licenseID,
            licenseKey: encryptedLicenseData,
            licenseOwner,
            licenseEmail,
            licenseExpiry: expiryTimestamp || licenseExpiry, // Store timestamp or "endless"
            licenseDeviceCount,
            operationTime
        });

        res.status(201).json({ message: 'License created successfully', payload: newLicense });
    } catch (error) {
        console.error('Error creating license:', error);
        res.status(500).json({ message: 'Unexpected error during license creation' });
    }
};