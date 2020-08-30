const mongoose = require('mongoose');

const postSchema = require('./post.model').postSchema;

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    name: { first: String, last: String },
    avatar: {type: String, default: 'data:image/svg+xml;base64,CjxpbWcgc3R5bGU9IndpZHRoOiAxMDAlOyBoZWlnaHQ6IGF1dG87IGZsb2F0OiBsZWZ0O2JhY2tncm91bmQtaW1hZ2U6IG5vbmU7IiBzcmM9Ii8vY2RuLm9ubGluZXdlYmZvbnRzLmNvbS9zdmcvaW1nXzU2ODY1Ni5wbmciIGFsdD0iVXNlciBQcm9maWxlIEF2YXRhciBMb2dpbiBBY2NvdW50Ij4KICA=" width="64" height="64'},
    posts: [postSchema],
    friends: {
        existing: String,
        outcommingRequests: String,
        incommingRequests: String
    }
}, { timestamps: true});

const UserModel = mongoose.model('user', userSchema);

module.exports = {
    UserModel
}