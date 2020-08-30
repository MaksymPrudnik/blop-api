const UserModel = require('../../models/user.model').UserModel;

const handleUpdateUser = (req, res, jwt) => {
    const { username } = req.params;
    const { authorization } = req.headers;
    const userToken = jwt.verify(authorization, process.env.JWT_SECRET).username;
    if (username === userToken) {
        const {firstname, lastname, avatar } = req.body;
        return UserModel.findOne({ username })
        .then(user => {
            user.set({
                name: {
                    first: firstname,
                    last: lastname
                },
                avatar: avatar || 'data:image/svg+xml;base64,CjxpbWcgc3R5bGU9IndpZHRoOiAxMDAlOyBoZWlnaHQ6IGF1dG87IGZsb2F0OiBsZWZ0O2JhY2tncm91bmQtaW1hZ2U6IG5vbmU7IiBzcmM9Ii8vY2RuLm9ubGluZXdlYmZvbnRzLmNvbS9zdmcvaW1nXzU2ODY1Ni5wbmciIGFsdD0iVXNlciBQcm9maWxlIEF2YXRhciBMb2dpbiBBY2NvdW50Ij4KICA=" width="64" height="64'
            });
            return user.save()
            .then(result => res.json(result))
            .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(400).json({err}));
    } else {
        return res.status(400).json('Wrong permission');
    }
}

module.exports = {
    handleUpdateUser
}