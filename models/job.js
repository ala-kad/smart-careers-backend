const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    publishedOn: Date,
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;