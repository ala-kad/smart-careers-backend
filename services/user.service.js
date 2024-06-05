const User = require('../models/user');

export default class userService { 
    getUser(){};
    
    async getAllUsers(req, res){
        try {
            const users = await User.find();
            res.status(200).send(users);
        } catch (error) {
            res.status(404).sen(error);
        }
    };
    updateuser(id){
        const usr = await User.findOneAndUpdate({_id: id})
    };
    deleteUser(){};
    registerUser(){};
    loginUser(){};
    logoutUser(){};
}