const UserModel = require('../../models/user.model').UserModel;
const PostModel = require('../../models/post.model').PostModel;

const handleModifyPost = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { id, header, body } = req.body;
    if (!id || !header || !body) {
        return res.status(400).json('Wrong submission');
    }
    const username = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return UserModel.findOne({ username }).then(user => {
        user.posts.id(id).set({ header, body });
        return user.save().then(() => {
            return PostModel.findOne({ _id: id }).then(post => {
                post.set({ header, body });
                return post.save()
                .then(updatedPost => res.json(updatedPost))
                .catch(() => res.status(400).json('Unable to save post'));
            })
            .catch(() => res.status(400).json('Unable to find post'));
        })
        .catch(() => res.status(400).json('Unable to save user'));
    })
    .catch(() => res.status(400).json('Unable to find user'));
}

module.exports = {
    handleModifyPost
}