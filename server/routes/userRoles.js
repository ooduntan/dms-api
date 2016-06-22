(function(argument) {
  'use strict';

  var role = require('../controllers/rolesController');
  var express = require('express');
  var router = express.Router();

  router.post('/role', role.createRole);
  router.get('/role', role.getAllrole);
  router.put('/role/:id', role.editRole);
  router.delete('/role/:id', role.deleteRole);
  router.get('/role/:id', role.getOneRole);

  module.exports = router;

}());
