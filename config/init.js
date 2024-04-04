const { User, Admin } = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const initAdminAccount = async(req, res) => { 
    let admin = await Admin.findOne();
    if(admin) { res.status(400).json('Admin exists') }
    else{
        password = 'admin'
        bcrypt.hash(password, 10, async (err, hash) => {
            admin = await Admin.create({
                email: 'kaddechiala@gmail.com',
                username: 'alakad',
                password: hash,
                role: 'admin'
            });
            res.status(200).json({admin})

        })
    }
}

module.exports = { initAdminAccount } ; 