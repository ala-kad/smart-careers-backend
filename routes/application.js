var express = require('express');
var router = express.Router();
var { listCandidateApplications, stepOneApplication, respondQuestions, submitJobApplication, checkIfCandidateApplied } = require('../controllers/applicationsController');
var { uploadCv } = require('../middlewares/multer-config');


router.post('/upload-cv', uploadCv, stepOneApplication);

router.post('/responses', respondQuestions);

router.get('/apply', submitJobApplication);

router.get('', listCandidateApplications);

router.get('/check-if-applied', checkIfCandidateApplied);


module.exports = router;