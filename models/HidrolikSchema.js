const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HidrolikSchema = new Schema({
    OrderNumber: String,
    OrderDate: String,
    Type: String,
    PDF: String,
    InCharge: String,
    PartList: String
});

module.exports = mongoose.model('hidrolik', HidrolikSchema);
