const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String, 
    company: String,
    skills: [String],
    requiredExperience: Number,
    description: String, 
    location: {
       type: String,
       enum: ['onsite', 'hybrid', 'remote']
    },
    publishedOn: {
        type: Date,
        default: Date.now()
    },
}, { versionKey: false });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;