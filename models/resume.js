const mongoose = require('mongoose'); 

const resumeSchema = new mongoose.Schema({
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now },
    candidateId: { 
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
}, {versionKey: false});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

