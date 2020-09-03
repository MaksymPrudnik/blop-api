const { response } = require('express');

const PostModel = require('../../models/post.model').PostModel;

const handleListPosts = (req, res) => {
    const { from } = req.params;
    return PostModel.find({}).skip(Number(from))
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json(err));
}

module.exports = {
    handleListPosts
}