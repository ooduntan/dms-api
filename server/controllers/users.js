(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var userService = require('../service/userService');
  var auth = require('../middleware/auth');

  module.exports = {
    signUp: function(req, res) {
      helper.formatAndSaveData(req.body, function(dataSaved, error) {
        if (dataSaved) {
          res.json({
            success: true,
            message: 'User ' + req.body.username + ' created!'
          });
        } else {
          res.status(500).send({
            success: false,
            message: error
          });
        }
        console.log(helper.formatedData);
      });
    },
    authenticateUser: function(req, res, next) {
      var token = req.body.token || req.query.token || req.headers.token;
      if (token) {
        auth.verifyToken(req, res, next, token);
      } else {
        return res.status(403).send({
          success: false,
          message: 'Access denied. Provide your username and password.'
        });

      }
    },
    login: function(req, res) {
      var userInfo = { username: req.body.username };
      userService.getUsers(userInfo, function(result, message) {
        if (result) {
          message = message[0];
          res.json({
            message: 'Welcome ' + message.name.lastname +
              ' ' + message.name.firstname,
            error: result,
            token: auth.createToken(message._doc)
          });
        } else {
          res.json({
            message: 'User ' + req.body.username + ' does not exisit',
            error: message
          });
        }
      });
    },
    editUser: function(req, res) {
      if (helper.validateData(helper.userRequirement, req.body, false)) {
        userService.updateUserData(helper.formatedData, req.params.id, function(result, message) {
          res.json({
            message: result,
            error: message
          });
        });
      }
    },
    deleteUser: function(req, res) {
      userService.deleteOneUser(req.params.id, function(result, message) {
        res.json({ users: message });
      });
    },
    getOneUsers: function(req, res) {
      var id = req.params.id;
      userService.getUsers({ _id: id }, function(result, userData) {
        if (result) {
          res.json({ users: userData });
        } else {
          res.json({
            message: 'User does not exisit',
            error: userData
          });
        }
      });
    },
    getAllUsers: function(req, res) {
      userService.getUsers({}, function(result, userData) {
        if (result) {
          res.json({ users: userData });
        } else {
          res.json({
            message: 'User does not exisit',
            error: userData
          });
        }
      });
    }
  };

})();
