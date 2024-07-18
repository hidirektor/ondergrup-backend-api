const HydraulicUnit = require('../../models/HydraulicUnit');

/**
 * @swagger
 * /getHydraulicCustomInfo:
 *   post:
 *     summary: Get custom hydraulic unit information based on unit type
 *     tags: [HydraulicUnit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UnitType:
 *                 type: string
 *                 description: Type of the hydraulic unit
 *                 example: "TypeA"
 *     responses:
 *       200:
 *         description: A list of hydraulic unit information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the hydraulic unit
 *                     example: 1
 *                   userID:
 *                     type: integer
 *                     description: ID of the user associated with the unit
 *                     example: 101
 *                   userName:
 *                     type: string
 *                     description: Name of the user associated with the unit
 *                     example: "John Doe"
 *                   orderID:
 *                     type: integer
 *                     description: ID of the order associated with the unit
 *                     example: 202
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the hydraulic unit was created
 *                     example: "2023-07-01T12:00:00Z"
 *                   hydraulicType:
 *                     type: string
 *                     description: Type of the hydraulic unit
 *                     example: "TypeA"
 *                   pdfFile:
 *                     type: string
 *                     description: URL to the PDF file associated with the unit
 *                     example: "http://example.com/files/unit.pdf"
 *                   excelFile:
 *                     type: string
 *                     description: URL to the Excel file associated with the unit
 *                     example: "http://example.com/files/unit.xlsx"
 *                   createdBy:
 *                     type: string
 *                     description: Name of the user who created the hydraulic unit entry
 *                     example: "Admin"
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
        const hydraulicInfoResult = await HydraulicUnit.findAll({
            where: {
                hydraulicType: UnitType
            },
            attributes: ['id', 'userID', 'userName', 'orderID', 'partListID', 'schematicID', 'hydraulicType', 'createdDate']
        });

        if(!hydraulicInfoResult || hydraulicInfoResult.length === 0) {
            return res.status(400).json({ message: 'No hydraulic unit data found' });
        }

        return res.status(200).json(hydraulicInfoResult);

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getCustomHydraulicInfo;