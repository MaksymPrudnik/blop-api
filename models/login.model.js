const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    hash: {type: String, required: true}
});

const LoginModel = mongoose.model('LoginModel', loginSchema);

module.exports = {
    LoginModel
}