const UserModel = require('../../models/user.model').UserModel;
const PostModel = require('../../models/post.model').PostModel;

const handleDeletePost = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { id } = req.params;
    if (!id) {
        return res.status(400).json('Wrong submission');
    };
    const username = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return UserModel.findOne({ username }).then(user => {
        user.posts.pull(id);
        return user.save()
        .then(() => {
            return PostModel.deleteOne({ _id: id})
            .then((result) => res.json({result: Boolean(result.ok), count: result.n}))
            .catch(err => res.status(400).json(`${err}`))
        })
        .catch(err => res.status(400).json(`${err}`))
    })
    .catch(err => res.status(400).json(`${err}`))
}

module.exports = {
    handleDeletePost
}