const mongoose = require('mongoose');

const postSchema = require('./post.model').postSchema;

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    name: { first: String, last: String },
    avatar: String,
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