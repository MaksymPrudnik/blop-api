const UserModel = require('../../models/user.model').UserModel;

const handleDeleteUser = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { username } = req.params;
    const userToken = jwt.verify(authorization, process.env.JWT_SECRET).username;
    if (username === userToken) {
        return UserModel.deleteOne({ username })
        .then(result => res.json({result: Boolean(result.ok), count: result.n}))
        .catch(err => res.status(400).json({err}));
    } else {
        return res.status(400).json('Wrong permission');
    }
}

module.exports = {
    handleDeleteUser
}