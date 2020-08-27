const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const jwt = require('jsonwebtoken');

const app = express();

//setup MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URL);

app.get('/', (req, res) => home.handleHome(req, res, db));
app.post('/signin', (req, res) => signin.signinAuth(req, res, db, bcrypt, jwt, redisClient));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt, jwt, redisClient));
app.post('/signout', (req, res) => signout.handleSignout(req, res, redisClient));
app.post('/send-friend-request', (req, res) => friends.sendRequest(req, res, db));
app.post('/manage-friend-request', (req, res) => friends.manageRequest(req, res, db));
app.post('/remove-friend', (req, res) => friends.removeFriend(req, res, db));

app.listen(3000, () => {
    console.log('app is running on port 3000');
})