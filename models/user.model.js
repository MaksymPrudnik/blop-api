const mongoose = require('mongoose');

const postSchema = require('./post.model').postSchema;

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    name: { first: String, last: String },
    avatar: {type: String, default: 'https://i.ytimg.com/vi/p5Vsg1CrhrI/hqdefault.jpg'},
    posts: [postSchema],
    friends: {
        existing: [String],
        outcommingRequests: [String],
        incommingRequests: [String]
    },
    notifications: {
        allowed: {type: Boolean, default: false},
        asked: {type: Boolean, default: false},
        subscription: {type: Object, default: null}
    }
}, { timestamps: true});

const UserModel = mongoose.model('user', userSchema);

module.exports = {
    UserModel
}