const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    answer: {
        type: mongoose.Schema.Types.Mixed,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire'
    }
}, { versionKey: false });

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;