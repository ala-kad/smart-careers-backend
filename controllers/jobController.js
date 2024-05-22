const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const Job = require('../models/job'); 

const createJob = async (req, res) => { 
    const { title, responsibilities, qualificationsSkills, salaryBenefits, workEnv, questions, description} = req.body 
    console.log(req.body);
    try {
        const job = await Job.create({
            title: title,
            responsibilities: responsibilities,
            skillsQualitfications: qualificationsSkills,
            benefits: salaryBenefits,
            location: workEnv,
            questions: questions,
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllJobs = async (req, res) => { 
    try{
        switch(req.query.status) { 
            case 'Draft': 
                const draftJobs = await Job.find({ status: 'Draft'});
                res.status(200).json(draftJobs);
            break;
            case 'Published':
                const publishedJobs = await Job.find({ status: 'Published'});
                res.status(200).json(publishedJobs);
            break;
            default: 
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

const getJobQuestions = async (req, res) => { 
    try{
        let job = await Job.findById(req.params.id); 
        let questions = job.questions; 
        res.status(200).send(questions);
    } catch(err) {
        res.status(500).send(err);
    }
}

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
                res.status(201).json('Job status updated');
        })

    }catch(error) { 
        res.status(500).json(error)
    }
}


const generateJobText = async(req, res) => { 
    try{
        const generationConfig = {
          temperature: 0.5,
          topK: 0,
          topP: 1,
          maxOutputTokens: 2048,
        };
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", generationConfig: generationConfig }, );
        const { title, responsibilities, qualificationsSkills, salaryBenefits, workEnv } = req.body;
        const prompt = 
        `
          You are now RecruiterGPT a seasoned world-class recruiter with over 20+ years of exepreince in rectuiting. 
          As RecruiterGPT, your roles are: 
          To generate concise job offers.
          Please include an introduction first in the description, 
          Based on the following informations and structure in JSON Format : 
              -JSON: Title: ${title}, 
              -JSON: Responsibiliteis: ${responsibilities}, 
              -JSON: Qualifications and Skills: ${qualificationsSkills}, 
              -JSON: Salary and Benfits: ${salaryBenefits}, 
              -JSON: Work mode and culture: ${workEnv}
          Generate a job description , in HTML format that will be used in a WYSIWYG rich-text editor 
          Eleminate line brakes characters and any special characters from the response text that does not relate to the context of recruiting and job posting
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).json(text);
    }catch(err) { 
        res.status(500).send(err.message)
    }
}

module.exports = { createJob, getAllJobs, getOneJob, getJobQuestions, updateJob, deleteJob, publishJob, generateJobText } ; 