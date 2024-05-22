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
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum: roles.map((role) => role.name)
    },
    avatar: String,
    phone: Number,
    adress: String,
    resumes: [{ 
        type: mongoose.Types.ObjectId,
        ref: 'Resume'
    }],
    enabled: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

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


const User = mongoose.model('User', userSchema);

module.exports = User ;