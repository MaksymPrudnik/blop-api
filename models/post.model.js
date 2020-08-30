const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    createdBy: String,
    body: String
}, {timestamps: true})

const postSchema = new mongoose.Schema({
    createdBy: String,
    header: String,
    body: String,
    comments: [commentSchema]
}, { timestamps: true });

const PostModel = mongoose.model('post', postSchema);

module.exports = {
    PostModel,
    postSchema
}