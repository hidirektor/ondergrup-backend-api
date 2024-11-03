const CryptoJS = require('crypto-js');
const SECRET_KEY = process.env.JWT_SECRET;

function encryptLicense(data) {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined');
    }
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
}

function decryptLicense(ciphertext) {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined');
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

module.exports = { encryptLicense, decryptLicense };