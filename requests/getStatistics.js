const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connectionPool = mysql.createPool({
    host: process.env.NODE_SERVERNAME,
    user: process.env.NODE_USERNAME,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    connectionLimit: 10
});

async function getStatistics(req, res) {
    try {
        const [totalOrdersResult] = await connectionPool.promise().query(
            'SELECT COUNT(*) as totalOrders FROM HidrolikUnit'
        );

        const [klasikResult] = await connectionPool.promise().query(
            'SELECT COUNT(*) as klasikCount FROM HidrolikUnit WHERE Unite_Tipi = "Klasik"'
        );

        const [hidrosResult] = await connectionPool.promise().query(
            'SELECT COUNT(*) as hidrosCount FROM HidrolikUnit WHERE Unite_Tipi = "Hidros"'
        );

        const statistics = {
            "Sipariş Sayısı": totalOrdersResult[0].totalOrders,
            "Klasik": klasikResult[0].klasikCount,
            "Hidros": hidrosResult[0].hidrosCount
        };

        return res.status(200).json(statistics);

    } catch (error) {
        console.error('MySQL sorgu hatası:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
}

module.exports = getStatistics;
