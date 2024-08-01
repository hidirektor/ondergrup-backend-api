const HydraulicUnit = require('../../models/HydraulicUnit');

/**
 * @swagger
 * /getHydraulicUnitNumber:
 *   get:
 *     summary: Get list of all hydraulic unit order numbers
 *     tags: [HydraulicUnit]
 *     responses:
 *       200:
 *         description: A list of hydraulic unit order numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved hydraulic unit numbers.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: string
 *                       example: 'ORD12345'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */

const getHydraulicUnitNumber = async (req, res) => {
    try {
        const count = await HydraulicUnit.count();

        if (count === 0) {
            return res.status(400).json({ message: 'No hydraulic unit data found' });
        }

        return res.status(200).json({ message: 'Successfully retrieved hydraulic unit numbers.', payload: { count }});
    } catch (error) {
        console.error('Error retrieving hydraulic unit order numbers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getHydraulicUnitNumber;