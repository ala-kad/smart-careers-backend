var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken'); 

var { User, Admin, Candidate, Recruiter } = require('../models/user');

exports.registerUser =  async (req, res) => {
    try { 
        const { email, username, password, role, ...roleFields } = req.body;

        const usr = await User.findOne({ email: email });
        if(usr) { res.status(400).send(`User already exists`) }
        else { 
            bcrypt.hash(password, 10, async (err, hash) => {
                if(err) { 
                    res.status(500).send(err)
                }
                switch (role) {
                    case 'admin':
                        var usr = await Admin.create({ email, username, password: hash, role, ...roleFields }) ; 
                        res.status(201).send(`User created : ${usr}`);
                        break;
                    case 'recruiter':
                        var usr = await Recruiter.create({ email, username, password: hash, role, ...roleFields }) ;
                        res.status(201).send(`User created : ${usr}`);
                        break;
                    case 'candidate':
                        var usr = await Candidate.create({email, username, password: hash, role, ...roleFields}) ;
                        res.status(201).send(`User created : ${usr}`);
                        break;
                    default: 
                        await User.create({ email, username,  password: hash, role }) 
                        .then((user) => { 
                            res.status(201).send(user);
                        }).catch((err) => { 
                            res.status(500).send(err)
                        })
                        break;
                }
                
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
        return res.status(404).send(err.message);
    }
}

