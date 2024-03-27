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
        enum: ['admin', 'candidate', 'recruiter', 'guest'], 
        required: true
    },
},{ versionKey: false});

const adminSchema = new mongoose.Schema({ 
   
})
const candidateSchema = new mongoose.Schema({ 
    firstname: String, 
    lastname: String,
    adress: String,
    phone: Number,
    applications: String // To-Do change to obect ID Many to Many (One job have 1..n candidates, 1 Candidate have 1..n applications)
}, {discriminatorKey: 'role'});

const recruiterSchema = new mongoose.Schema({ 
    firstname: String, 
    lastname: String,
    adress: String,
    phone: Number,
    jobs: String // To-Do change to obect ID One User to Many Jobs (One job have 1 Recruiter(author), 1 Recruiter writes 1..n jobs)
}, {discriminatorKey: 'role'});


// userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema);

const Admin = User.discriminator('admin',userSchema );
const Candidate = User.discriminator('candidate', candidateSchema);
const Recruiter = User.discriminator('recruiter', recruiterSchema);

module.exports = { User, Admin, Candidate, Recruiter };