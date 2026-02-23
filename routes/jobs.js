const express = require('express');
const router = express.Router();
const { limiter, aiLimiter } = require('../middlewares/rateLimiter');

const { createJob, getAllJobs, getOneJob, getJobQuestions, updateJob, deleteJob, publishJob, generateJobText } = require('../controllers/jobController');
const { protect, checkPermission, authorizeRoles } = require('../middlewares/auth');

router.use(limiter); // Apply general rate limiter to all routes

/**
 * @openapi
 * /jobs:
 *   get:
 *     description: Shows all jobs!
 *     responses:
 *       200:
 *         description: Job Listing.
 *      500:
 *        description: Server error.
 */
router.get('/', getAllJobs);

/**
 * @openapi
 * /jobs/{id}:
 *  get:
 *   summary: Get a job by ID
 *  parameters:
 *    - in: path
 *      name: id
 *      description: The job ID
 *      required: true
 *      schema:
 *        type: string
 *  responses:
 *   200:
 *    description: A single job object
 *   404:
 *    description: Job not found
 */
router.get('/:id', getOneJob);

router.get('/:id/questions', getJobQuestions);

/**
 * Protected routes (require authentication)
 */

// Only Recruiters and Admins can create jobs or use GenAI features
router.post('/', protect, authorizeRoles('admin', 'recruiter'), createJob);
// router.post('/genIA', protect, authorizeRoles('admin', 'recruiter'), aiLimiter, generateJobText)
router.post('/genIA', aiLimiter, generateJobText)


// Update, Publish, and Delete should be restricted
router.patch('/:id', protect, authorizeRoles('admin', 'recruiter'), updateJob);
router.patch('/publish/:id', protect, authorizeRoles('admin', 'recruiter'), publishJob);


/**
 * Delete job
 */
router.delete('/:id', protect, authorizeRoles('admin'), deleteJob);

module.exports = router;