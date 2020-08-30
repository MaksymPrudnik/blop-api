const signToken = (username, jwt) => {
    const jwtPayload = { username };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET);
}

const setToken = (token, username, redisClient) => {
    return Promise.resolve(redisClient.set(token, username));
}

const createSession = (username, redisClient, jwt) => {
    if (username) {
        const token = signToken(username, jwt);
        return setToken(token, username, redisClient)
            .then(() => {
                return {
                    'success': true,
                    username,
                    token
                }
            })
            .catch(console.log)
    } else {
        return Promise.reject('Wrong arguments');
    }
}

module.exports = {
    createSession
}