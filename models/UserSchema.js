const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Role: String,
    UserName: String,
    Email: String,
    Password: String,
    NameSurname: String,
    Phone: String,
    Profile_Photo: String,
    CompanyName: String,
    Created_At: String,
});

module.exports = mongoose.model('users', UserSchema);
