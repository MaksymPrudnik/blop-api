const UserModel = require('../../models/user.model').UserModel;


const handleGetUserList = (req, res) => {
    const { usernamesList } = req.body;
    return UserModel.find({username: [ usernamesList ]})
    .then(list => res.json(list))
    .catch(err => res.status(400).json(err))
}

module.exports = {
    handleGetUserList
}