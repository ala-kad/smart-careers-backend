const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true
    },
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'candidate', 'recruiter', 'guest']
    }
},{ versionKey: false});

// userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema);

module.exports = User;