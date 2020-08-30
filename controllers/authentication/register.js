const LoginModel = require('../../models/login.model').LoginModel;
const UserModel = require('../../models/user.model').UserModel;

const createSession = require('../../helpers/createSession').createSession;

const addUserToDB = (req, res, bcrypt) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return Promise.reject('Incorrect form submission');
    }
    const newUser = new UserModel({ username, email });
    newUser.save();
    const hash = bcrypt.hashSync(password);
    const newLogin = new LoginModel({ username, email, hash });
    return newLogin.save();
}

const handleRegister = (req, res, bcrypt, jwt, redisClient) => {
    return addUserToDB(req, res, bcrypt)
        .then(data => {
            return data.username && data.email && data.hash ? createSession(data.username, redisClient, jwt) : Promise.reject(data)
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err.code || err));  // if mongoose err - returns code | otherwise custom error string
}

module.exports = {
    handleRegister
}