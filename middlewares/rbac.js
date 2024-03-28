const Role = require('../models/roles');
const Permissions = require('../models/permessions')
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

exports.checkPermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.user ? req.user.role : 'anonymous';
        const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

        if(userPermissions.includes(permission)){
            return next();
        } else { 
            return res.status(403).json({ error : 'Access Denied !'})
        }
    }
}

exports.checkRole = (roles) => async (req, res, next) => {
    let { email } = req.body;
    const usr = await User.findOne({ email });

    console.log(`Passed roles params ${typeof (roles)}`);
    console.log(`Req.body.email = ${email}`);

    console.log(`DB user ${usr}`);
    console.log(`DB user role ${typeof(usr.role)}`);

    !roles.includes(usr.role) ? res.status(401).json("Sorry you do not have access to this route") : res.statuts(200).json('welcome admin') 

    // roles.forEach(role => {
        
    // });

}

exports.authUser = asyncHandler(async(req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    token ? req.token = token : res.status(401).json({ error: 'Unauthorized: Token missing' });
    // Verify the token 
    const decoded = jwt.verify(req.token, process.env.JWT_KEY);
    // Attach the decoded token payload to the request object for further processing
    req.user = decoded;
    // Call next middleware
    next();
});

exports.authAdmin = (req, res, next) => {
    req.user.role.includes('admin') ? next() :  res.status(401).json({ error: 'Unauthorized: Token missing' });
}
