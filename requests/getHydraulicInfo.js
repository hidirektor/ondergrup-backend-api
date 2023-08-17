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

async function getHydraulicInfo(req, res) {
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

module.exports = getHydraulicInfo;