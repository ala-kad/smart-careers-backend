const Application = require('../models/application');
const Resume = require('../models/resume');
const Question = require('../models/questions');
const Response = require('../models/responses');
const GeminiService = require('../services/gemini.service');

const asyncHandler = require('express-async-handler');
const path = require('path');

const stepOneApplication = asyncHandler(async (req, res) => {
    const { candidateId, jobId } = req.query;
    const url = req.protocol + "://" + req.get("host");

    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a CV' });
    }

    const resume = await Resume.create({
        filename: req.file.filename,
        url: url + "/public/" + req.file.filename,
        candidateId: candidateId,
    });

    await resume.save();

    const application = await Application.create({
        candidateId: candidateId,
        jobId: jobId,
        resume: resume._id,
    });

    await application.save();
    res.status(200).send(application);
});

const respondQuestions = asyncHandler(async (req, res) => {
    const { candidateId, jobId } = req.query;
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses.responses)) {
        return res.status(400).json({ error: 'Invalid responses payload' });
    }

    const questions = await Question.find({ jobId: jobId });

    const responsePromises = responses.responses.map((response, index) => {
        const question = questions[index];
        return Response.create({
            answer: response.answer,
            questionId: question ? question._id : undefined,
        });
    });

    const createdResponses = await Promise.all(responsePromises);

    const application = await Application.findOne({ candidateId: candidateId, jobId: jobId });
    if (!application) {
        return res.status(404).json({ error: 'Application not found' });
    }

    application.responses = createdResponses.map(r => r._id);
    const updatedApplication = await application.save();

    res.status(200).json(updatedApplication);
});

const submitJobApplication = asyncHandler(async (req, res) => {
    const { candidateId, jobId } = req.query;

    const application = await Application.findOne({
        candidateId: candidateId,
        jobId: jobId
    });

    if (application) return res.status(200).send(application);
    return res.status(404).json({ error: 'Application not found' });
});

const listCandidateApplications = asyncHandler(async (req, res) => {
    const { candidateId } = req.query;
    const applicationList = await Application.find({ candidateId: candidateId }).populate('jobId');
    res.status(200).json(applicationList);
});

const checkIfCandidateApplied = asyncHandler(async (req, res) => {
    const { jobId, candidateId } = req.query;
    const application = await Application.find({ jobId: jobId, candidateId: candidateId });
    if (application && application.length > 0) return res.status(400).json(application);
    return res.status(200).json({ status: 'can_apply' });
});

const listApplicationsByJobId = asyncHandler(async (req, res) => {
    const { jobId } = req.query;
    const applications = await Application.find({ jobId: jobId }).populate(['jobId', 'responses', 'resume', 'candidateId']);
    res.status(200).json(applications);
});

const screenApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
        .populate('jobId')
        .populate('resume')

    if (!application || !application.resume) {
        return res.status(404).json({ error: 'Application not found' });
    }

    const pdfPath = path.join(__dirname, '..', 'public/resumes/', application.resume.filename);
    const resumeContent = await GeminiService.analyzeCandidateMatch(pdfPath);

    const jobDescription = application.jobId.description || application.jobId.responsibilities;
    const analysis = await GeminiService.analyzeCandidateMatch(
        jobDescription,
        resumeContent
    );

    application.aiAnalysis = analysis;
    application.status = analysis.matchPercentage >= 75 ? 'Selection' : 'Hr_validation';
    await application.save();

    res.status(200).json({
        success: true,
        matchPercentage: analysis.matchPercentage,
        recommendation: analysis.hiringRecommendation,
        fullAnalysis: analysis
    });
})

module.exports = {
    listCandidateApplications,
    stepOneApplication,
    respondQuestions,
    submitJobApplication,
    checkIfCandidateApplied,
    listApplicationsByJobId,
    screenApplication,
};