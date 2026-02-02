const User = require('../models/user');
const Role = require('../models/role');
const rolesSeed = require('../models/roles');
const bcrypt = require('bcryptjs');
const connect = require('../config/db');

const initAdminAccount = async () => {
    // Ensure DB connection and seed roles idempotently
    await connect();

    await Promise.all(
        rolesSeed.map(r =>
            Role.updateOne(
                { name: r.name },
                { $setOnInsert: { name: r.name } },
                { upsert: true }
            )
        )
    );

    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) throw new Error('Admin role not found after seeding');

    const admin = await User.findOne({ role: { $in: [adminRole._id] } });
    if (admin) return { status: 'admin_exists' };

    const password = process.env.ADMIN_PSWD;
    if (!password) throw new Error('ADMIN_PSWD is not configured');

    const hash = await bcrypt.hash(password, 10);
    const created = await User.create({
        email: 'kaddechiala@gmail.com',
        username: 'alakad',
        password: hash,
        role: [adminRole._id]
    });

    return { status: 'admin_created', id: created._id };
};

initAdminAccount().catch(err => {
    // Emit a process warning so upstream process managers or logs can capture it
    process.emitWarning(`initAdminAccount failed: ${err.message}`);
});

module.exports = { initAdminAccount }; 