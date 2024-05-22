const Application = require('../models/application');
const Resume = require('../models/resume');
const { User } = require('../models/user');

const sendApplication = async(req, res) => { 
    try{
        const { userId, jobId } = req.query;
        const { responses } = req.body;
        let resume; 
        console.log('Request File', req.file);
        if(req.file) { 
            resume = new Resume({
                candidateId: userId,
                filename: req.file.filename,
                url: req.file.filename
            });
            await resume.save();
            // Add resume to user's resume library
            // await User.find(userId, { $push: { resumes: resume._id } })
        } else { 
            resume = await Resume.find({ candidateId: userId })
        }
        
        let application = await Application.create({
            // candidateId: userId,
            // jobId: jobId,
            responses: responses,
            resume: resume._id,
        });
        await application.save();
        res.status(200).json(application)
    } catch(err) { 
        console.log(err)
        res.status(500).json(err)
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

module.exports = { sendApplication, listCandidateApplications };