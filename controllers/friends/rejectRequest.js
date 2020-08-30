const manageRequests = require('../../helpers/manageFriendRequest').manageRequests;

const rejectFriendRequest = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { from } = req.params;
    if (!from) {
        res.status(400).json('Wrong request');
    }
    const to = jwt.verify(authorization, process.env.JWT_SECRET || 'JWT_SECRET').username;
    return manageRequests(from, to, 'remove')
    .this(result => res.json(result))
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    rejectFriendRequest
}