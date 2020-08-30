const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const jwt = require('jsonwebtoken');

// Authentication
const register = require('./controllers/authentication/register');
const signin = require('./controllers/authentication/signin');
const signout = require('./controllers/authentication/signout');
// Posts
const createPost = require('./controllers/posts/createPost');
const modifyPost = require('./controllers/posts/modifyPost');
const deletePost = require('./controllers/posts/deletePost');
const listPosts = require('./controllers/posts/listPosts');
// User profille
const getUser = require('./controllers/user/getUser');
const updateUser = require('./controllers/user/updateUser');
const deleteUser = require('./controllers/user/deleteUser');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// setup MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URL);

app.get('/', (req, res) => res.send('this is working'));
// Authentication
app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, jwt, redisClient));
app.post('/signin', (req, res) => signin.signinAuth(req, res, bcrypt, jwt, redisClient));
app.post('/signout', (req, res) => signout.handleSignout(req, res, redisClient));
// Posts
app.post('/create-post', (req, res) => createPost.handleCreatePost(req, res, jwt));
app.post('/modify-post', (req, res) => modifyPost.handleModifyPost(req, res, jwt));
app.post('/delete-post', (req, res) => deletePost.handleDeletePost(req, res, jwt));
app.get('/posts', (req, res) => listPosts.handleListPosts(req, res, jwt));
// User profile
app.get('/user/:username', (req, res) => getUser.handleGetUser(req, res));
app.post('/update/:username', (req, res) => updateUser.handleUpdateUser(req, res, jwt));
app.post('/delete/:username', (req, res) => deleteUser.handleDeleteUser(req, res, jwt));
// Friends
app.post('/send-friend-request', (req, res) => friends.sendRequest(req, res, mongoose));
app.post('/manage-friend-request', (req, res) => friends.manageRequest(req, res, mongoose));
app.post('/remove-friend', (req, res) => friends.removeFriend(req, res, mongoose));

app.listen(3000, () => {
    console.log('app is running on port 3000');
})