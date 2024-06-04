const mongoose = require('mongoose');

const applicationSchema =  new mongoose.Schema({
    appplicationDate: {
        type: Date,
        default: Date.now()
    },
    candidateId: { 
        type: mongoose.Types.ObjectId,
        ref: 'user'
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
    }
}, { versionKey: false })

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
