const { json } = require('express');
const Role = require('../models/role');
const asyncHandler = require('express-async-handler');

const create = asyncHandler(async(req, res ) => { 
    const role = await Role.create(req.body);
    res.status(201).json(role);
});

const index = asyncHandler(async(req, res) => { 
    const roles = await Role.find();
    res.status(200).json(roles);
});

const show = asyncHandler(async(req, res) => { 
    // const role = await Role.findById(req.params.id);
    // console.log(req.params.id);
    // res.status(200).json(req.params.id);
    console.log('hello');
    res.send('hello')
});

const edit = asyncHandler(async(req, res) => { 
    await Role.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json('updated role');
})

const remove = async (req, res) => { 
    try{
        const role = await Role.findOne(req.params.id);
        console.log(role);
        if(!role){ res.status(404).json('Role not found') };
        await role.deleteOne();
        res.status(200).json('deleted role');
    }catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

module.exports = { create, index, show, edit, remove };