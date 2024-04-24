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
        console.log('Req Params', req.params.status);
        console.log('Req Query', req.query.status);
        switch(req.query.status) { 
            case 'Draft': 
                console.log('Draft');
                const draftJobs = await Job.find({ status: 'Draft'});
                res.status(200).json(draftJobs);
            break;
            case 'Published':
                console.log('Published');
                const publishedJobs = await Job.find({ status: 'Published'});
                res.status(200).json(publishedJobs);
            break;
            default: 
                console.log('Default');
                const jobs = await Job.find();
                res.status(200).json(jobs);
            break;
        }
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

const publishJob = async(req, res) => { 
    try{ 
        const job = await Job.findById(req.params.id);
        job.status = 'Published';
        await job.save()
        .then(
            updatedJob => {
                console.log(updatedJob);
                res.status(201).json('Job status updated');
        })

    }catch(error) { 
        res.status(500).json(error)
    }
}

module.exports = { createJob, getAllJobs, getOneJob, updateJob, deleteJob, publishJob } ; 