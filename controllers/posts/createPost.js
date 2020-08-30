const PostModel = require('../../models/post.model').PostModel;
const UserModel = require('../../models/user.model').UserModel;

const handleCreatePost = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { header, body } = req.body;
    if (!header || !body) {
        res.status(400).json("Wrong submission");
    }
    const username = jwt.verify(authorization, process.env.JWT_SECRET || 'JWT_SECRET').username;
    const newPost = new PostModel({
        createdBy: username,
        header,
        body
    });
    return UserModel.findOne({ username }).then(user => {
        user.posts.push(newPost);
        return user.save().then((userUpdated) => { // update user
            return newPost.save().then(post => res.json(post)); // create post
        });
    })
}

module.exports = {
    handleCreatePost
}