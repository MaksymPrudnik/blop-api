const PostModel = require('../../models/post.model').PostModel;

const handleListPosts = (req, res) => {
    const { from } = req.body;
    return PostModel.find({}).skip(from)
    .then(posts => res.json(posts))
}

module.exports = {
    handleListPosts
}