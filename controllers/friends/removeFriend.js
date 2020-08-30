const { manageFriends } = require("../../helpers/manageFriend");

const removeFriend = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { username } = req.params;
    if (!username) {
        return res.status(400).json('Wrong request');
    }
    const from = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return manageFriends(from, username, 'remove')
    .then(result => res.json(result))
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    removeFriend
}