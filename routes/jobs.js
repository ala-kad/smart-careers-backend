const express = require('express');
const router = express.Router();

const { createJob, getAllJobs, getOneJob, updateJob, deleteJob, publishJob, generateJobText } = require('../controllers/jobController');

/**
 *  Create Job
 */
router.post('/', createJob);

router.post('/genIA', generateJobText)

/**
 * Job listing
 */
router.get('/', getAllJobs);

/**
 * Get one job
 */
router.get('/:id', getOneJob);

/**
 * Update job
 */
router.patch('/:id', updateJob);

/**
 * Publish Job to Public
 */
router.patch('/publish/:id', publishJob);
/**
 * Delete job
 */
router.delete('/:id', deleteJob);

module.exports = router ;