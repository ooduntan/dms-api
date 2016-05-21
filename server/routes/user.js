var UserCtrl = require('../controllers/users');
var express = require('express');
var router = express.Router();

router.get('/users', UserCtrl.getAllUsers);
router.post('/users', UserCtrl.signup);

module.exports = router;
