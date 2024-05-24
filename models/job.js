const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String, 
    responsibilities: String,
    skillsQualitfications: String,   
    benefits: String,
    location: {
        type: String,
        enum: ['Onsite', 'Hybrid', 'Remote']
    },
    questions: [String],
    publishedOn: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Draft",
        enum: ['Draft', 'Published', 'Preselection', 'Hr_validation', 'Selection_test', 'Selection', 'Archived', 'Cancelled']
    },
    description: {
        type: String
    },
    recruiterId: { 
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { versionKey: false, timestamp: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;