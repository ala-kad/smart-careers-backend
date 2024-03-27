const { User } = require('../models/user');

const getAllUsers = async (req, res)  => { 
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getOneUser = async (req, res)  => { 
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

const updateUser = async (req, res) => { 
    try{ 
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(`User updated`);
    }catch(error){
        res.status(400).send(error);
    }
}

const deleteUser = async (req, res) => { 
    try {
        const user = await User.findById(req.params.id);
        if(!user) { return res.status(404).send(`User not found`) };
        await user.deleteOne();
        return res.status(200).send(`User deleted`);
    }catch(err) { 
        return res.status(500).send(err);
    }
}

module.exports = { getAllUsers, getOneUser, updateUser, deleteUser }; 