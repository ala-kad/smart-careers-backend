const mongoose = require('mongoose');

const applicationSchema = new mongoose.schema({
    appplicationDat: string,
    candidateId: { 
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    jobId: { 
        type: mongoose.Types.ObjectId,
        ref: 'Job'
    },
    cv: String,
    avatarPic: String
})

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
