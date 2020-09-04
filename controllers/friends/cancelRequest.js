const manageRequests = require('../../helpers/manageFriendRequest').manageRequests;

const cancelFriendRequest = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { to } = req.params;
    if (!from) {
        res.status(400).json('Wrong request');
    }
    const from = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return manageRequests(from, to, 'remove')
    .this(result => res.json(result))
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    cancelFriendRequest
}