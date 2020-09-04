const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Authentication
const register = require('./controllers/authentication/register');
const signin = require('./controllers/authentication/signin');
const signout = require('./controllers/authentication/signout');
// Authentication middleware
const auth = require('./helpers/authorizationMiddleware');
// Posts
const createPost = require('./controllers/posts/createPost');
const modifyPost = require('./controllers/posts/modifyPost');
const deletePost = require('./controllers/posts/deletePost');
const listPosts = require('./controllers/posts/listPosts');
// User profille
const getUser = require('./controllers/user/getUser');
const getUserList = require('./controllers/user/getUserList');
const updateUser = require('./controllers/user/updateUser');
const deleteUser = require('./controllers/user/deleteUser');
// Friends
const sendRequest = require('./controllers/friends/sendRequest');
const acceptRequest = require('./controllers/friends/acceptRequest');
const rejectRequest = require('./controllers/friends/rejectRequest');
const cancelRequest = require('./controllers/friends/cancelRequest');
const removeFriend = require('./controllers/friends/removeFriend');
// Comments
const addComment = require('./controllers/comment/addComment');
const editComment = require('./controllers/comment/editComment');
const deleteComment = require('./controllers/comment/deleteComment');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

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
app.post('/signout', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => signout.handleSignout(req, res, redisClient));
// Posts
app.post('/create-post', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => createPost.handleCreatePost(req, res, jwt));
app.post('/modify-post', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => modifyPost.handleModifyPost(req, res, jwt));
app.post('/delete-post', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => deletePost.handleDeletePost(req, res, jwt));
app.get('/posts/:from', (req, res) => listPosts.handleListPosts(req, res, jwt));
// User profile
app.get('/user/:username', (req, res) => getUser.handleGetUser(req, res));
app.post('/user-list', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => getUserList.handleGetUserList(req, res, jwt));
app.post('/update/:username', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => updateUser.handleUpdateUser(req, res, jwt));
app.post('/delete/:username', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => deleteUser.handleDeleteUser(req, res, jwt));
// Friends
app.post('/friend-request/:to', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => sendRequest.sendFriendRequest(req, res, jwt));
app.post('/accept-request/:from', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => acceptRequest.acceptFriendRequest(req, res, jwt));
app.post('/reject-request/:from', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => rejectRequest.rejectFriendRequest(req, res, jwt));
app.post('/cancel-request/:to', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => cancelRequest.cancelFriendRequest(req, res, jwt));
app.post('/friend-remove/:username', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => removeFriend.removeFriend(req, res, jwt));
// Comments
app.post('/add-comment/:post', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => addComment.handleAddComment(req, res, jwt));
app.post('/edit-comment/:post', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => editComment.handleEditComment(req, res, jwt));
app.post('/delete-comment/:post', (req, res, next) => auth.requireAuth(req, res, redisClient, next), (req, res) => deleteComment.handleDeleteComment(req, res, jwt));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})