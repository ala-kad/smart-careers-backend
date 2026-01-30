const mongoose = require('mongoose');
   
const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    role: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    enabled: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User ;