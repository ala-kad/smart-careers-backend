const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Permissions = require('../models/permessions');
const User = require('../models/user');

// Unified Authentication and Authorization Middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token extraction
      token = req.headers.authorization.split(' ')[1];

      // Token verification
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      // Attach user to request object (without password) 
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
});

//Permission Checker
const checkPermission = (permission) => {
  return (req, res, next) => {
    // نعتمد على الدور المخزن في req.user الذي وضعه الـ protect middleware
    const userRole = req.user ? req.user.role : 'anonymous';
    const permissionsInstance = new Permissions();
    const userPermissions = permissionsInstance.getPermissionsByRoleName(userRole);

    if (userPermissions && userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Access Denied: Missing Permissions' });
    }
  };
};

//Role Checker
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, checkPermission, authorizeRoles };