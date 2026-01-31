const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Role = require('../models/role');

// Helper to accept either role names or ObjectId strings and return ObjectId array
const resolveRoleIds = async (rolesInput) => {
    if (!Array.isArray(rolesInput)) {
        const err = new Error('roles must be an array of role names or ids');
        err.status = 400;
        throw err;
    }
    if (rolesInput.length === 0) return [];

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const ids = [];
    const namesToLookup = [];

    for (const r of rolesInput) {
        if (objectIdRegex.test(String(r))) ids.push(r);
        else namesToLookup.push(r);
    }

    if (namesToLookup.length > 0) {
        const rolesFound = await Role.find({ name: { $in: namesToLookup } });
        const foundNames = rolesFound.map(r => r.name);
        const missing = namesToLookup.filter(n => !foundNames.includes(n));
        if (missing.length > 0) {
            const err = new Error(`Roles not found: ${missing.join(', ')}`);
            err.status = 400;
            throw err;
        }
        ids.push(...rolesFound.map(r => r._id));
    }

    return ids;
}

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().populate('role', 'name');
    res.status(200).json(users);
});

const getOneUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('role', 'name');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
});

const getEnabledUsers = asyncHandler(async (req, res) => {
    const excluded = await Role.find({ name: { $in: ['admin', 'candidate'] } }).select('_id');
    const excludedIds = excluded.map(r => r._id);

    const users = await User.find({
        enabled: true,
        role: { $nin: excludedIds }
    }).populate('role', 'name');

    res.status(200).json(users);
});

const getDisabledUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ enabled: false }).populate('role', 'name');
    res.status(200).json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const roleInput = req.body;
    const roleIds = await resolveRoleIds(roleInput);

    user.role = roleIds;
    await user.save();

    res.status(200).json({ status: 'user_updated' });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.deleteOne();
    res.status(200).json({ status: 'user_deleted' });
});

const disableUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.enabled = false;
    await user.save();
    res.status(200).json({ status: 'user_disabled' });
});

const deleteAll = asyncHandler(async (req, res) => {
    await User.deleteMany();
    res.status(200).json({ status: 'users_deleted' });
});

const getCandidateInfos = asyncHandler(async (req, res) => {
    const candidate = await User.findById(req.params.userId).populate('role', 'name');
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.status(200).json(candidate);
});

module.exports = { getAllUsers, getOneUser, updateUserRole, deleteUser, deleteAll, disableUser, getEnabledUsers, getDisabledUsers, getCandidateInfos }; 