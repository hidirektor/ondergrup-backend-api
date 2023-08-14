const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    UserType: String,
    UserName: String,
    Password: String,
    NameSurname: String,
    Email: String,
    CompanyName: String,
    Phone: String,
    ProfilePhoto: String,
});

module.exports = mongoose.model('users', UserSchema);
