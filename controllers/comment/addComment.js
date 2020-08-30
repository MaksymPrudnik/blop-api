const { UserModel } = require("../../models/user.model");
const { PostModel } = require("../../models/post.model");
const { CommentModel } = require("../../models/comment.model");

const handleAddComment = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { post } = req.params;
    const { body, postOwner } = req.body;
    if (!post || !body || !postOwner) {
        return res.status(400).json('Wrong request')
    }
    const username = jwt.verify(authorization, process.env.JWT_SECRET).username;
    const newComment = new CommentModel({
        createdBy: username,
        body
    });
    return UserModel.findOne({ username: postOwner })
    .then(user => {
        user.posts.id(post).comments.push(newComment);
        return user.save()
        .then(() => {
            return PostModel.findOne({_id: post})
            .then(post => {
                post.comments.push(newComment);
                return post.save()
                .then(updatedPost => res.json(updatedPost))
                .catch(err => res.status(400).json({err}));
            })
            .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(400).json({err}));
    })
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    handleAddComment
}