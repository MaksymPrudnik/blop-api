const { UserModel } = require('../../models/user.model');

const handleAddSubscription = (req, res, jwt) => {
    const { authorization } = req.headers;
    const { subscription } = req.body;
    if (!authorization || !subscription) res.status(400).json('Wrong Submission');

    const username = jwt.verify(authorization, process.env.JWT_SECRET).username;

    return UserModel.findOne({username})
    .then(user => {
        user.set({notifications: {...user.notifications, subscription}})
        return user.save()
    })
    .then(() => res.status(202).json({}))
    .catch(error => res.json(500).json({error}))
}

module.exports = {
    handleAddSubscription
}