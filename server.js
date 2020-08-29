const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const jwt = require('jsonwebtoken');

const register = require('./controllers/authentication/register');
const signin = require('./controllers/authentication/signin');
const signout = require('./controllers/authentication/signout');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//setup MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URL);

app.get('/', (req, res) => {
    return res.send('this is working')
});
app.post('/signin', (req, res) => signin.signinAuth(req, res, bcrypt, jwt, redisClient));
app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, jwt, redisClient));
app.post('/signout', (req, res) => signout.handleSignout(req, res, redisClient));
app.post('/send-friend-request', (req, res) => friends.sendRequest(req, res, mongoose));
app.post('/manage-friend-request', (req, res) => friends.manageRequest(req, res, mongoose));
app.post('/remove-friend', (req, res) => friends.removeFriend(req, res, mongoose));

app.listen(3000, () => {
    console.log('app is running on port 3000');
})