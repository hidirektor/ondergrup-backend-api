const HydraulicUnit = require('../../models/HydraulicUnit');

/**
 * @swagger
 * /getHydraulicStats:
 *   get:
 *     summary: Get statistics for hydraulic units
 *     tags: [HydraulicUnit]
 *     responses:
 *       200:
 *         description: Statistics of hydraulic units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Sipariş Sayısı:
 *                   type: integer
 *                   description: Total number of orders
 *                   example: 150
 *                 Klasik:
 *                   type: integer
 *                   description: Number of 'Klasik' type hydraulic units
 *                   example: 75
 *                 Hidros:
 *                   type: integer
 *                   description: Number of 'Hidros' type hydraulic units
 *                   example: 50
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

const getHydraulicStats = async (req, res) => {
    try {
        const totalOrdersResult = await HydraulicUnit.count();

        const klasikCountResult = await HydraulicUnit.count({
            where: {
                hydraulicType: 'Klasik'
            }
        });

        const hidrosCountResult = await HydraulicUnit.count({
            where: {
                hydraulicType: 'Hidros'
            }
        });

        const statistics = {
            "Sipariş Sayısı": totalOrdersResult,
            "Klasik": klasikCountResult,
            "Hidros": hidrosCountResult
        };

        return res.status(200).json(statistics);

    } catch (error) {
        console.error('Sequelize sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = getHydraulicStats;