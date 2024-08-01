const HydraulicUnit = require('../../models/HydraulicUnit');

/**
 * @swagger
 * /getHydraulicDetails:
 *   get:
 *     summary: Get details for hydraulic units
 *     tags: [HydraulicUnit]
 *     responses:
 *       200:
 *         description: Statistics of hydraulic units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved hydraulic details.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     hydraulicUnits:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HydraulicUnit'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No hydraulic unit data found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Sunucu hatası"
 */

const getCustomHydraulicInfo = async (req, res, next) => {
    const { UnitType } = req.body;
    try {

        let hydraulicInfoResult;

        if (UnitType) {
            hydraulicInfoResult = await HydraulicUnit.findAll({
                where: {
                    hydraulicType: UnitType
                }
            });
        } else {
            hydraulicInfoResult = await HydraulicUnit.findAll();
        }

        if(!hydraulicInfoResult || hydraulicInfoResult.length === 0) {
            return res.status(400).json({ message: 'No hydraulic unit data found.' });
        }

        return res.status(200).json({ message: 'Successfully retrieved hydraulic details.', payload: { hydraulicInfoResult } });

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getCustomHydraulicInfo;