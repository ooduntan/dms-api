(function() {
  'use strict';

  var helper = require('./controllerHelper'),
    auth = require('../middleware/auth'),
    userService = require('../service/userService'),
    twoWayCrypt = require('../middleware/reversibleEncrypt'),
    userHelper = require('./userControllerHelper');


  module.exports = {
    signUp: function(req, res) {
      var formatedUserObject = helper.validatAndFormatData(req.body, true);
      if (formatedUserObject.bool.value) {
        userHelper.saveUser(res, formatedUserObject.data);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
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
      var formatedUserObject = helper.validatAndFormatData(req.body, false);
      if (formatedUserObject.bool.value) {
        userHelper.updateUserData(res, formatedUserObject.data, req.params.id);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    deleteUser: function(req, res) {
      if (req.params.id.isNumber()) {
        userHelper.removeUser(res, req.params.id);
      } else {
        var message = { failed: 'Invalid document id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getOneUsers: function(req, res) {
      var id = req.params.id;
      if (id.isNumber()) {
        userService.findUsers({ _id: id }, function(bool, message) {
          helper.dataResponder(res, bool, message[0], 'user', 204);
        });
      } else {
        var message = { failed: 'Invalid document id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getAllUsers: function(req, res) {
      userService.findUsers({}, function(bool, result) {
        helper.dataResponder(res, bool, result, 'user', 204);
      });
    }
  };

}());
