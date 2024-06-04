const Application = require('../models/application');
const Resume = require('../models/resume');
const Question = require('../models/questions');
const Response = require('../models/responses');

const stepOneApplication = async(req, res) => {
    try{
        const { candidateId, jobId } = req.query;
        const url = req.protocol + "://" + req.get("host");
        if(req.file) { 
            let resume = await Resume.create({               
                filename: req.file.filename,
                url: url + "/public/" + req.file.filename,
                candidateId: candidateId,
            });
            await resume.save();            
            let application = await Application.create({
                candidateId: candidateId,
                jobId: jobId,
                resume: resume._id,
            })
            await application.save();
            res.status(200).send(application);
        }else {
            console.log('Please upload a CV ! ');
        }
    }catch(err) { 
        console.log(err)
        res.status(500).send(err)
    }
}

const respondQuestions = async (req, res) => { 
    try {
        const { candidateId, jobId } = req.query; 
        const { responses } = req.body;

        console.log('Req Body:', req.body);
        console.log('Req responses:', responses);

        Question.find({ jobId: jobId })
        .then(questions => {
            const responsePromises = responses.responses.map((response, index) => {
                return Response.create({
                    answer: response.answer,
                    questionId: questions[index]._id,
                });
            });
            // Wait for all response creation promises to resolve
            Promise.all(responsePromises)
            .then(createdResponses => {
                Application.findOne({ candidateId: candidateId, jobId: jobId })
                .then(application => {
                    if (!application) {
                        throw new Error("Application not found");
                    }
                    application.responses = createdResponses.map(r => r._id);
                    application.save()
                    .then(updatedApplication => {
                        console.log('Application updated:', updatedApplication);
                        res.status(200).json(updatedApplication);
                    })
                    .catch(err => {
                        console.error('Error saving application:', err);
                        res.status(500).json({ error: 'Error saving application' });
                    });
                })
                .catch(err => {
                    console.error('Error finding application:', err);
                    res.status(500).json({ error: 'Error finding application' });
                });
            })
            .catch(err => {
                console.error('Error creating responses:', err);
                res.status(500).json({ error: 'Error creating responses' });
            });
        })
        .catch(err => {
            console.error('Error finding questions:', err);
            res.status(500).json({ error: 'Error finding questions' });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const submitJobApplication = async(req, res) => { 
    try{
        const { candidateId, jobId } = req.query;
        console.log('Query Params', req.query)
        let application = await Application.findOne({
            candidateId: candidateId,
            jobId: jobId
        })
        if(application) { 
            console.log('Application confirmed', application)
           return res.status(200).send(application)
        }
        console.log('Application not confirmed')
        return res.status(404).send('Not found')
    }catch(err) {
        console.log(err);
        return res.status(500).send(err)
    }
}

const listCandidateApplications = async(req, res) => { 
    try{
        const { candidateId } = req.query
        console.log(req.query);
        const applicationList = await Application.find({
            candidateId: candidateId
        }).populate('jobId')
        
        res.status(200).json(applicationList);
    }catch(err){
        res.status(500).send(err)
    }
}

const checkIfCandidateApplied = async(req, res) => {
    try{
        const { jobId, candidateId } = req.query;
        console.log('Query Params', req.query);
        let application = await Application.find({jobId: jobId, candidateId: candidateId});
        if(application) { 
            console.log('You have already applied for this job', application);
            return res.status(200).json(application)
        }else { 
            return res.status(200).json('You can apply')
        }   
    }catch(err){
        console.log('soemthing went wrong oups ! ', err);
        return res.status(500).json(err.message);
    }
}

module.exports = { listCandidateApplications, stepOneApplication, respondQuestions, submitJobApplication, checkIfCandidateApplied };