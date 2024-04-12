const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const initAdminAccount = async() => { 
    try{ 
        let admin = await User.findOne( { role: 'admin'}).maxTimeMS(50000);
        if(admin) { console.log('Admin exists') }
        else{
            password = 'admin'
            bcrypt.hash(password, 10, async (err, hash) => {
                admin = await User.create({
                    email: 'kaddechiala@gmail.com',
                    username: 'alakad',
                    password: hash,
                    role: 'admin'
                });
               console.log('Admin created');
    
            })
        }
    }catch (err) { 
        console.log(err.message);
    }
}

module.exports = { initAdminAccount } ; 