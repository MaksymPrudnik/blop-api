const UserModel = require('../models/user.model').UserModel;

const addRequest = (user, requestArray, request) => {
    // check if there's such request
    if (requestArray.includes(request)) {
        return Promise.reject('Already exist');
    }
    // adding requests
    requestArray.push(request);
    return user.save()
    .then(user => user)
    .catch(err => Promise.reject(err));
}

const removeRequest = (user, requestArray, request) => {
    // check if there's such request
    if (!requestArray.includes(request)) {
        return Promise.reject('Do not exist');
    }
    // removing requests
    requestArray.pull(request);
    return user.save()
    .then(user => user)
    .catch(err => Promise.reject(err));
}

const manageRequests = (from, to, action) => {
    if (!from || !to || !action) {
        return Promise.reject('Wrong function call');
    }
    return UserModel.find({ username: [from, to]})
    .then(users => {
        if (users.length !== 2) {
            return Promise.reject('Users not fount');
        }
        if (action === 'set') { // setting new requests
            return Promise.all(users.map(user => {
                if (user.username === from) {
                    return addRequest(user, user.friends.outcommingRequests, to);
                } else if (user.username === to) {
                    return addRequest(user, user.friends.incommingRequests, from);
                } else {
                    return Promise.reject('Query error')
                }
            }));
        } else if (action === 'remove') { //removing requests
            return Promise.all(users.map(user => {
                if (user.username === from) {
                    return removeRequest(user, user.friends.outcommingRequests, to);
                } else if (user.username === to) {
                    return removeRequest(user, user.friends.incommingRequests, from);
                } else {
                    return Promise.reject('Query error')
                }
            }))
        } else {
            return Promise.reject('Wrong action');
        }
        
    })
    .catch(err => Promise.reject(err));
}

module.exports = {
    manageRequests
}