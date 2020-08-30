const manageFriends = require('../../helpers/manageFriend').manageFriends;
const manageRequests = require('../../helpers/manageFriendRequest').manageRequests;

const acceptFriendRequest = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { from } = req.params;
    if (!from) {
        res.status(400).json('Wrong request');
    }
    const to = jwt.verify(authorization, process.env.JWT_SECRET || 'JWT_SECRET').username;
    return manageRequests(from, to, 'remove')
    .then(result => {
        if (result.length !== 2) {
            return res.status(400).json('Error deleting requests');
        }
        return manageFriends(from, to, 'add')
        .then(result => {
            if (result.length !== 2) {
                return res.status(400).json('Error adding friend');
            }
            return res.json(result);
        })
        .catch(err => res.status(400).json({err}));
    })
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    acceptFriendRequest
}