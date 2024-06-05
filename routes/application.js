var express = require('express');
var router = express.Router();
var { listCandidateApplications, stepOneApplication, respondQuestions, submitJobApplication, checkIfCandidateApplied, listApplicationsByJobId } = require('../controllers/applicationsController');
var { uploadCv } = require('../middlewares/multer-config');


router.post('/upload-cv', uploadCv, stepOneApplication);

router.post('/responses', respondQuestions);

router.get('/apply', submitJobApplication);

router.get('', listCandidateApplications);

router.get('/check-if-applied', checkIfCandidateApplied);

router.get('/list-applications', listApplicationsByJobId);

module.exports = router;