const { UserModel } = require("../../models/user.model");
const { PostModel } = require("../../models/post.model");

const handleEditComment = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { post } = req.params;
    const { body, id, postOwner } = req.body;
    if (!post || !body || !id || !postOwner) {
        return res.status(400).json('Wrong request')
    }
    const username = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return UserModel.findOne({ username: postOwner })
    .then(user => {
        if (user.posts.id(post).comments.id(id).createdBy !== username) {
            return res.status(400).json('Wrong permission');
        }
        user.posts.id(post).comments.id(id).set({createdBy: username, body});
        return user.save()
        .then(() => {
            return PostModel.findOne({_id: post})
            .then(post => {
                post.comments.id(id).set({createdBy: username, body});
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
    handleEditComment
}