const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String, 
    skills: [String],
    requiredExperience: Number,
    description: String, 
    profile: String,
    benefits: String,
    questions: [String],
    location: {
       type: String,
       enum: ['onsite', 'hybrid', 'remote']
    },
    publishedOn: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Draft",
        enum: ['Draft', 'Published', 'Preselection', 'Hr_validation', 'Selection_test', 'Selection', 'Archived', 'Cancelled']
    }
}, { versionKey: false, timestamp: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;