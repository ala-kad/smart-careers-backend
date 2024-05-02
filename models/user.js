const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

const  Permissions = ['create', 'read', 'update', 'delete', 'all', 'none'];

const roles = require('./roles.js')
   
const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true
    },
    username: String,
    password: {
        type: String,
        required: true
    },
    confirmationPass: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum: roles.map((role) => role.name)
    },
    enabled: {
        type: Boolean,
        default: true
    }
},{ versionKey: false});

/**
 * Admin Schema
 */
const adminSchema = new mongoose.Schema({ 
   isAdmin: {
    type: Boolean,
    default: true
    }
}, {discriminatorKey: 'role'});

/**
 * Candidate Schema
 */
const candidateSchema = new mongoose.Schema({ 
    firstname: String, 
    lastname: String,
    adress: String,
    phone: Number,
    photo: String, 
    cvFilename: String,
    skills: [String],
    experienceYears: Number,
    applications: [String] // To-Do change to obect ID Many to Many (One job have 1..n candidates, 1 Candidate have 1..n applications)
}, {discriminatorKey: 'role'});

/**
 * Recruiter Schema
 */
const recruiterSchema = new mongoose.Schema({ 
    firstname: String, 
    lastname: String,
    phone: Number,
}, {discriminatorKey: 'role'});


// userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema);

// const Admin = User.discriminator('admin', adminSchema );
// const Candidate = User.discriminator('candidate', candidateSchema);
// const Recruiter = User.discriminator('recruiter', recruiterSchema);

module.exports = { User };