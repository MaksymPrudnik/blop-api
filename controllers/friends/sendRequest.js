const manageRequests = require('../../helpers/manageFriendRequest').manageRequests;

const sendFriendRequest = (req, res, jwt, webpush) => {
    const { authorization } = req.headers;
    const { to } = req.params;
    if (!to) {
        return res.status(400).json('Wrong request');
    }
    const from = jwt.verify(authorization, process.env.JWT_SECRET).username;
    return manageRequests(from, to, 'set') // sets out- and incomming request from user to user
    .then(result => {
        if (result.length === 2 && result[1].notifications.subscription) {
            const payload = JSON.stringify({
                title: 'New friend request',
                body: `${from} send you a friend request`
            })
            webpush.sendNotification(result[1].notifications.subscription, payload)
            .catch(console.log)
        }
        return res.json(result)
    })
    .catch(err => res.status(400).json({err}));
}

module.exports = {
    sendFriendRequest
}