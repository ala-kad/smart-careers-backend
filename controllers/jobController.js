const Job = require('../models/job'); 

const createJob = async (req, res) => { 
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllJobs = async (req, res) => { 
    try{
        const jobs = await Job.find();
        res.status(201).json(jobs);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getOneJob = async (req, res) => { 
    try{
        const job = await Job.findById(req.params.id);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateJob = async (req, res) => { 
    try{
        const job = await Job.findById(req.params.id);
        if(!job) { res.status(404).json('Job not found') }
        else{
            await job.updateOne(req.body);
            res.status(201).json('Job updated');
        }
    } catch(error) { 
        res.status(500).json(error);
    }
}

const deleteJob = async (req, res) => { 
    try{
        const job = await Job.findById(req.params.id);
        if(!job) { res.status(404).json('Job not found') }
        else{
            await job.deleteOne(req.body);
            res.status(201).json('Job deleted');
        }
    } catch(error) { 
        res.status(500).json(error);
    }
}

module.exports = { createJob, getAllJobs, getOneJob, updateJob, deleteJob } ; 