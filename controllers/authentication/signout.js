const delAuthToken = (req, res, redisClient) => {
    const { authorization } = req.headers;
    return redisClient.del(authorization, (err, username) => {
        if (err || !username) {
            return res.status(400).json('Wrong token')
        } else {
            return res.json({result: Boolean(username)})
        }
    })
}

const handleSignout = (req, res, redisClient) => {
    const { authorization } = req.headers;
    return authorization ? delAuthToken(req, res, redisClient) : Promise.reject('No token sent')
        .then(data => res.json(data))
        .catch(data => res.status(400).json(data))
}

module.exports = {
    handleSignout
}