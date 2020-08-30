const UserModel = require('../models/user.model').UserModel;

const addFriend = (user, friend) => {
    if (!user || !friend) {
        return Promise.reject('Wrong function call');
    }
    // check if already friends
    if (user.friends.existing.includes(friend)) {
        return Promise.reject('Already exist');
    }
    // add new friend
    user.friends.existing.push(friend);
    return user.save()
    .then(result => result)
    .catch(err => Promise.reject(err));
}

const removeFriend = (user, friend) => {
    if (!user || !friend) {
        return Promise.reject('Wrong function call');
    }
    // check if friends exist
    if (!user.friends.existing.includes(friend)) {
        return Promise.reject('Do not exist');
    }
    // add new friend
    user.friends.existing.pull(friend);
    return user.save()
    .then(result => result)
    .catch(err => Promise.reject(err));
}

const manageFriends = (from, to, action) => {
    if (!from || !to || !action) {
        return Promise.reject('Wrong function call');
    }
    return UserModel.find({ username: [from, to]})
    .then(users => {
        if (users.length !== 2) {
            return Promise.reject('Users not fount');
        }
        if (action === 'add') { // adding friend
            return Promise.all(users.map(user => {
                if (user.username === from) {
                    return addFriend(user, to);
                } else if (user.username === to) {
                    return addFriend(user, from);
                } else {
                    return Promise.reject('Query error')
                }
            }))
        } else if (action === 'remove') {
            return Promise.all(users.map(user => {
                if (user.username === from) {
                    return removeFriend(user, to);
                } else if (user.username === to) {
                    return removeFriend(user, from);
                } else {
                    return Promise.reject('Query error')
                }
            }))
        } else {
            return Promise.reject('Wrong action');
        }
    })
}

module.exports = {
    manageFriends
}