const asyncHandler = require('express-async-handler');
const  User = require('../models/user');

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
        console.log(error)
        res.status(500).send(error);
    }
}

const getEnabledUsers = async(req, res) => { 
    try { 
        const users = await User.find({ 
            $and: [                
                { role: { $ne: 'admin' } } ,
                { role: { $ne: 'candidate' } } ,
                { enabled: true }, 
            ] 
        })
        console.log(users)
        res.status(200).json(users); 
    }catch(err) {
        console.log(err.message);
    }
} 

const getDisabledUsers = async(req, res) => {
    try{ 
        return res.status(200).send( await User.find({ enabled: false }))
    }catch(err){ 
        console.log(err);
        return res.status(500).send(err);
    }
}

const updateUserRole = async (req, res) => { 
    try{ 
        const user = await User.findById(req.params.id);

        if(!user) { return res.status(404).send('User not found') }
        else { 
            user.role = req.body ;
            await user.save();
            res.status(201).send('User updated');
        }
    }catch(error){
        console.log(error)
        return res.status(400).json(error);
    }
}

const deleteUser = async (req, res) => { 
    try {
        const user = await User.findById(req.params.id);
        if(!user) { return res.status(404).json(`User not found`) };
        await user.deleteOne();
        return res.status(200).json(`User deleted`);
    }catch(err) { 
        return res.status(500).send(err);
    }
}

const disableUser = async (req, res) => { 
    try {
        const user = await User.findById(req.params.id);
        if(!user) { return res.status(404).json(`User not found`) };
        user.enabled = false;
        await user.save()
        return res.status(200).json(`User disabled`);
    }catch(err) { 
        return res.status(500).send(err);
    }
}

const deleteAll = asyncHandler(async(req, res) => { 
    await User.deleteMany();
    res.status(200).send(`Users deleted`);
})

const getCandidateInfos = async(req, res) => {
    try{
        let candidate = await User.findById(req.params.userId);
        res.status(200).send(candidate);
    } catch(err) {
        res.status(500).send(err)
    }
}

module.exports = { getAllUsers, getOneUser, updateUserRole, deleteUser, deleteAll, disableUser, getEnabledUsers, getDisabledUsers, getCandidateInfos }; 