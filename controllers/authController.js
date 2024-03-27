var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken'); 

var User = require('../models/user');

exports.registerUser =  async (req, res) => {
    try { 
        const { email, username, password, role } = req.body;
        const usr = await User.findOne({ email: email });
        if(usr) { res.status(400).send(`User already exists`) }
        else { 
            bcrypt.hash(password, 10, async (err, hash) => {
                if(err) { 
                    res.status(500).send(err)
                }
                await User.create({
                    email: email,
                    username: username,
                    password: hash,
                    role: role
                }).then((user) => { 
                    res.status(201).send(user);
                }).catch((err) => { 
                    res.status(500).send(err)
                })
            })
        }
    }catch(error) { 
        res.status(500).send(error);
    }
}

exports.loginUser = async (req, res) => { 
    try { 
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }) ; 
        if(!user) { return res.status(404).send(`User not found`) };
        const validPass = await bcrypt.compare(password, user.password); 
        if(!validPass) { return res.status(401).send(`Wrong password`) } 
        else { 
            const payload = {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '5 days'}); 
            return res.status(200).json({message: 'Logged in', token})
        }
    }catch(err) { 
        console.log(err);
        return res.status(404).send(err.message);
    }
}

