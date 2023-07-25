const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HidrolikSchema = new Schema({
    Creator: String
});

module.exports = mongoose.model('Hidrolik', HidrolikSchema);
