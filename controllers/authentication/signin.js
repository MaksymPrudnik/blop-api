const createSession = require("../../helpers/createSession").createSession;
const LoginModel = require('../../models/login.model').LoginModel;

const handleSignin = (req, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('Incorrect form submission');
    }
    return LoginModel.find()
        .where('email').equals(email)
        .select('email hash')
        .exec()
        .then(user => { // returns array of found users | empty array if no users found
            if (!user.length) {
                return Promise.reject('Wrong credentials');
            }
            const isPasswordValid = bcrypt.compareSync(password, user[0].hash);
            if (isPasswordValid) {
                return user[0];
            } else {
                return Promise.reject('Wrong credentials');
            }
        })
}

const getAuthTokenEmail = (req, res, redisClient) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, email) => {
        if (err || !email ) {
            return res.status(400).json('Unauthorized');
        } else {
            return res.json({ email });
        }
    })
}

const signinAuth = (req, res, bcrypt, jwt, redisClient) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenEmail(req, res, redisClient) : handleSignin(req, bcrypt)
        .then(data => {
            return data.email ? createSession(data.email, redisClient, jwt) : Promise.reject(data)
        })
        .then(session => {
            return res.json(session)})
        .catch(err => res.status(400).json(err))
}

module.exports = {
    signinAuth
}