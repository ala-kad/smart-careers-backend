var express = require('express');
var router = express.Router();
var { sendApplication, listCandidateApplications } = require('../controllers/applicationsController');
var { uploadAvatar, uploadCv } = require('../middlewares/multer-config');

router.post('', uploadCv, sendApplication);

router.get('', listCandidateApplications);

module.exports = router;