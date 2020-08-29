const signToken = (email, jwt) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET || 'JWT_SECRET');
}

const setToken = (token, email, redisClient) => {
    return Promise.resolve(redisClient.set(token, email));
}

const createSession = (email, redisClient, jwt) => {
    if (email) {
        const token = signToken(email, jwt);
        return setToken(token, email, redisClient)
            .then(() => {
                return {
                    'success': true,
                    email,
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