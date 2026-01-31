const Role = require('../models/role');
const asyncHandler = require('express-async-handler');

const create = asyncHandler(async (req, res) => {
    const role = await Role.create(req.body);
    res.status(201).json(role);
});

const index = asyncHandler(async (req, res) => {
    const roles = await Role.find();
    res.status(200).json(roles);
});

const show = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.status(200).json(role);
});

const edit = asyncHandler(async (req, res) => {
    await Role.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ status: 'role_updated' });
})

const remove = asyncHandler(async(req, res) => {
    const role = await Role.findOne(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    await role.deleteOne();
    res.status(200).json({ status: 'role_deleted' });
});

module.exports = { create, index, edit, show, remove };