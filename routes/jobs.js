const express = require('express');
const router = express.Router();

const { createJob, getAllJobs, getOneJob, updateJob, deleteJob } = require('../controllers/jobController');

/**
 *  Create Job
 */
router.post('/', createJob);

/**
 * Job listing
 */
router.get('/', getAllJobs);

/**
 * Get one job
 */
router.get('/:id', getOneJob);

/**
 * Updtae job
 */
router.patch('/:id', updateJob);

/**
 * Delete job
 */
router.delete('/:id', deleteJob);

module.exports = router ;