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
 *               type: array
 *               items:
 *                 type: string
 *                 example: "ORD12345"
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
        const allOrderNumbers = await HydraulicUnit.find({}, 'orderID');

        const orderNumbers = allOrderNumbers.map((order) => order.orderID.trim());

        res.json(orderNumbers);
    } catch (error) {
        console.error('Error retrieving HydraulicUnit part list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getHydraulicUnitNumber;