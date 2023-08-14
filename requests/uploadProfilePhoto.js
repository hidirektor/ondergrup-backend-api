const fs = require('fs');
const path = require('path');

const uploadPhoto = (req, res) => {
    // Fotoğrafın yolu
    const photoPath = req.file.path;

    // Kullanıcı adını alın
    const userName = req.body.userName; // Örnek olarak bu şekilde gönderildiğini varsayalım

    // Kullanıcının klasörünü oluştur
    const userFolderPath = path.join(__dirname, `../data/${userName}`);
    if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath);
    }

    // Fotoğrafı kullanıcının klasörüne taşı
    const targetPath = path.join(userFolderPath, req.file.originalname);
    fs.renameSync(photoPath, targetPath);

    res.status(200).json({ message: 'Fotoğraf başarıyla yüklendi.' });
};

module.exports = uploadPhoto;