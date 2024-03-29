const mongoose = require('mongoose'); 

roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {versionKey: false});


const Role = mongoose.model('Role', roleSchema);

module.exports = Role;