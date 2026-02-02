const mongoose = require('mongoose');

const applicationSchema =  new mongoose.Schema({
    applicationDate: {
        type: Date,
        default: Date.now
    },
    candidateId: { 
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    jobId: { 
        type: mongoose.Types.ObjectId,
        ref: 'Job'
    },
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response'
    }],
    status: { 
        type: String,
        default: 'Ongoing'
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Resume'
    },
    aiAnalysis: {
        matchPercentage: Number,
        strengths: [String],
        weaknesses: [String],
        hiringRecommendation: String,
        feedbackToCandidate: String
    }
}, { versionKey: false })

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
