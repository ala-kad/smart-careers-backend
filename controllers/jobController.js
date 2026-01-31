const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const Job = require('../models/job');
const Question = require('../models/questions');

const createJob = asyncHandler(async (req, res) => {
    const { title, responsibilities, qualificationsSkills, salaryBenefits, workEnv, questions } = req.body;
    const { recruiterId } = req.query;

    await Job.create({
        title: title,
        responsibilities: responsibilities,
        skillsQualitfications: qualificationsSkills,
        benefits: salaryBenefits,
        location: workEnv,
        recruiterId: recruiterId,
    }).then((j) => {
        const reformatQuestion = questions.map((item) => ({ ...item, jobId: j._id }));
        Question.insertMany(reformatQuestion);
        res.status(201).json(j);
    });
});

const getAllJobs = asyncHandler(async (req, res) => {
    switch (req.query.status) {
        case 'Draft': {
            const draftJobs = await Job.find({ status: 'Draft' });
            return res.status(200).json(draftJobs);
        }
        case 'Published': {
            const publishedJobs = await Job.find({ status: 'Published' });
            return res.status(200).json(publishedJobs);
        }
        default: {
            const jobs = await Job.find();
            return res.status(200).json(jobs);
        }
    }
});

const getOneJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(job);
});

const getJobQuestions = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    const questions = await Question.find({ jobId: job._id });
    res.status(200).send(questions);
});

const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    await job.updateOne(req.body);
    res.status(200).json({ status: 'job_updated' });
});

const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    await job.deleteOne(req.body);
    res.status(200).json({ status: 'job_deleted' });
});

const publishJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    job.status = 'Published';
    await job.save();
    res.status(200).json({ status: 'job_published' });
});

const generateJobText = asyncHandler(async (req, res) => {
    const generationConfig = {
        temperature: 0,
        topK: 0,
        topP: 1,
        maxOutputTokens: 2048,
    };
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", generationConfig: generationConfig });
    const { title, qualificationsSkills } = req.body;
    const prompt = `Act as a world-class HR Expert. Generate a professional job offer in JSON format:
        { "summary": "...", "detailedDescription": "...", "shortBulletPoints": [] }
        Details: Title: ${title}, Skills: ${qualificationsSkills}...`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const structuredData = JSON.parse(response.text());
    res.status(200).json(structuredData);
});

module.exports = { createJob, getAllJobs, getOneJob, getJobQuestions, updateJob, deleteJob, publishJob, generateJobText }; 