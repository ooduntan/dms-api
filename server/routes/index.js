var express = require('express');
var router = express.Router();

router.use('/api', require('./user'));


router.get('/', function(req, res) {
  res.send('Welcome to Document management system');
});

module.exports = router;