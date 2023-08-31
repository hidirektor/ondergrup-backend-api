const mysql = require('mysql2');
const path = require("path");

const connectionPool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

module.exports = {
    orderNumbers: async (req, res, next) => {
        try {
            const allOrderNumbers = await HidrolikModel.find({}, 'OrderNumber');

            const orderNumbers = allOrderNumbers.map((order) => order.OrderNumber.trim());

            res.json(orderNumbers);
        } catch (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    },

    insertHidrolik: async (req, res, next) => {
        const { OrderNumber, OrderDate, Type, InCharge, PDF, PartList, InChargeName } = req.body;
        const Siparis_Tarihi = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const PDF_URL = path.join(__dirname, 'data', 'hydraulicUnits', PDF);
        const Excel_URL = path.join(__dirname, 'data', 'partList', PartList);

        const insertQuery = `INSERT INTO HidrolikUnit (unitID, UserName, Siparis_Numarasi, Siparis_Tarihi, Unite_Tipi, Pdf_File, Excel_File, Created_By)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        connectionPool.query(insertQuery, [OrderNumber, InCharge, OrderNumber, Siparis_Tarihi, Type, PDF_URL, Excel_URL, InChargeName], (err, results) => {
            if (err) {
                console.error('Sorgu hatası:', err);
                res.status(500).json({ error: 'Sunucu hatası' });
            } else {
                res.status(200).json({ message: 'Hidrolik başarıyla eklendi' });
            }
        });
    },

    hidrolikInfo: async (req, res, next) => {
        const field = req.params.field;
        const value = req.body[field];

        try {
            const hidrolik = await HidrolikModel.findOne({ OrderNumber: req.body.OrderNumber });
            if (hidrolik) {
                res.status(200).json({ [field.substring(1)]: hidrolik[field.substring(1)] });
            } else {
                res.status(404).json({ error: 'Veri bulunamadı.' });
            }
        } catch (err) {
            console.error('Hidrolik bilgisi alınırken bir hata oluştu:', err);
            res.status(500).json({ error: 'Sunucu hatası.' });
        }
    },

    getStatistics: async (req, res, next) => {
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
    },

    getHydraulicInfo: async (req, res, next) => {
        try {
            const [hydraulicInfoResult] = await connectionPool.promise().query(
                'SELECT unitID, UserName, Siparis_Numarasi, Siparis_Tarihi, Unite_Tipi, Pdf_File, Excel_File, Created_By FROM HidrolikUnit'
            );

            const response = hydraulicInfoResult.map(info => ({
                "unitID": info.unitID,
                "userName": info.UserName,
                "siparisNumarasi": info.Siparis_Numarasi,
                "siparisTarihi": info.Siparis_Tarihi,
                "uniteTipi": info.Unite_Tipi,
                "pdfFile": info.Pdf_File,
                "excelFile": info.Excel_File,
                "createdBy": info.Created_By
            }));

            return res.status(200).json(response);

        } catch (error) {
            console.error('MySQL sorgu hatası:', error);
            return res.status(500).json({ error: 'Sunucu hatası' });
        }
    }
}
