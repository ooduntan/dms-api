(function() {
  'use strict';
  var UserCtrl = require('../controllers/users');
  var express = require('express');
  var router = express.Router();

  router.post('/users', UserCtrl.signUp);
  router.post('/users/login', UserCtrl.login);
  router.use(UserCtrl.authenticateUser);
  router.get('/users', UserCtrl.getAllUsers);
  router.put('/users/:id', UserCtrl.editUser);
  router.delete('/users/:id', UserCtrl.deleteUser);
  router.get('/users/:id', UserCtrl.getOneUsers);
  //router.get('/users/logout', UserCtrl.logout);

  module.exports = router;
}());
