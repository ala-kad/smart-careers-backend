const express = require('express');
const router = express.Router();
const rbac = require('../middlewares/rbac');

var { create, index, show, edit, remove } = require('../controllers/rolesController');

router.post('/', create);

router.get('/', index);

router.get('/:id', show);

router.patch('/:id', edit);

router.delete('/:id', remove);

module.exports = router;