const mongoose = require('mongoose');
   
const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum: ['admin', 'recruiter', 'rh', 'technique','candidate']
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User ;