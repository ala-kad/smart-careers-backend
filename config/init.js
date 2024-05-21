var User = require('../models/user');
var bcrypt = require('bcrypt');
var connect = require('../config/db');

const initAdminAccount = async() => { 
    try{ 
        await connect();
        let admin = await User.findOne({ role: 'admin'});
        if(admin) { 
            console.log('Admin exists') 
            // res.status(400).send('Admin exists');
        }
        else{
            password = process.env.ADMIN_PSWD;
            bcrypt.hash(password, 10, async (err, hash) => {
                admin = await User.create({
                    email: 'kaddechiala@gmail.com',
                    username: 'alakad',
                    password: hash,
                    role: 'admin'
                });
                await admin.save();
               console.log('Admin created');
            //    res.status(200).send('Admin created');
            })
        }
    }catch (err) { 
        console.log(err.message);
        // res.status(500).send('Error in creating admin');
    }
}

initAdminAccount();

module.exports = { initAdminAccount } ; 