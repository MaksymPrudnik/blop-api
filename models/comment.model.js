const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    createdBy: String,
    body: String
}, {timestamps: true})

const CommentModel = mongoose.model('comment', commentSchema);

module.exports = {
    commentSchema,
    CommentModel
}