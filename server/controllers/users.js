(function() {
  'use strict';

  var helper = require('./controllerHelper'),
    auth = require('../middleware/auth'),
    userService = require('../service/userService'),
    twoWayCrypt = require('../middleware/reversibleEncrypt'),
    userHelper = require('./userControllerHelper');


  module.exports = {
    signUp: function(req, res) {

      helper.validatAndFormatData(req.body, true,
        function(bool, formatedUserData) {
          var errorMessage = 'compulsory fields Missing';
          helper.saveDataHandler(res, bool, formatedUserData,
            userHelper.saveUser, errorMessage);
        });
    },
    authenticateUser: function(req, res, next) {
      var token = req.body.token || req.query.token || req.headers.token;
      if (token) {
        var decryptedToken = twoWayCrypt.decrypt(token);
        auth.verifyToken(req, res, decryptedToken, next);
      } else {
        var result = { failed: 'Access denied.' };
        helper.messageResponder(res, false, result, 403);
      }
    },
    login: function(req, res) {
      var userData = {};
      if (req.body.username !== undefined && req.body.password !== undefined) {
        userData.username = req.body.username;
        userData.password = req.body.password;
        userHelper.validateAndCheckUser(res, userData);
      } else {
        var result = { failed: 'Invalid User Data.' };
        helper.messageResponder(res, false, result, 400);
      }
    },
    editUser: function(req, res) {
      helper.validatAndFormatData(req.body, false,
        function(bool, formatedUserData) {
          if (bool && typeof(formatedUserData) === 'object') {
            userHelper.updateUserData(res, formatedUserData, req.params.id);
          } else {
            var message = { failed: 'compulsory fields Missing' };
            helper.messageResponder(res, false, message, 400);
          }
        });
    },
    deleteUser: function(req, res) {
      if (req.params.id.isNumber()) {
        userHelper.removeUser(res, req.params.id);
      } else {
        var message = { failed: 'Invalid user id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getOneUsers: function(req, res) {
      var id = req.params.id;
      if (id.isNumber() || id.isUserName()) {
        var query = id.isNumber() ? { _id: id } : { username: id };
        userService.findUsers(query, function(bool, message) {
          helper.dataResponder(res, bool, message[0], 'user', 404);
        });
      } else {
        var message = { failed: 'Invalid username/id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getAllUsers: function(req, res) {
      var searchQuery = {};
      helper.getData(res, searchQuery, userService.findUsers, 'user');
    }
  };

}());
