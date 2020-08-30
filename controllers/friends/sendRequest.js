const manageRequests = require('../../helpers/manageFriendRequest').manageRequests;

const sendFriendRequest = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { to } = req.params;
    if (!to) {
        return res.status(400).json('Wrong request');
    }
    const from = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return manageRequests(from, to, 'set') // sets out- and incomming request from user to user
    .then(result => res.json(result))
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    sendFriendRequest
}