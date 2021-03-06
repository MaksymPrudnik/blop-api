const UserModel = require('../../models/user.model').UserModel;

const handleGetUser = (req, res) => {
    const { username } = req.params;
    return UserModel.findOne({ username })
    .then(user => {
        if(user === null) {
            return Promise.reject('User not found')
        }
        return res.json(user)})
    .catch(err => res.status(404).json({err}))
}

module.exports = {
    handleGetUser
}