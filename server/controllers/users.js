(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var auth = require('../middleware/auth');
  var userModel = require('../models/userModel');

  function saveUser(responseObject, userData) {
    userModel.saveUser(userData, function(bool, message) {
      var result = { success: message, failed: message };
      helper.messageResponder(responseObject, bool, result, 401);
    });
  }

  function findUser(responseObj, userData) {
    userModel.findUsers(userData, function(bool, result) {
      if (bool) {
        var token = auth.createToken(result[0]);
        helper.dataResponder(responseObj, bool, token, 'token', 402);
      } else {
        helper.messageResponder(responseObj, bool, result, 400);
      }
    });
  }

  function removeUser(responseObj, id) {
    userModel.deleteUserById(id, function(bool, message) {
      helper.dataResponder(responseObj, bool, message, 'user', 401);
    });
  }

  function validateAndCheckUser(respondObj, userData) {
    var formatedData = helper.validateUserData(userData, false);
    if (formatedData.bool.value) {
      findUser(respondObj, formatedData.data);
    } else {
      var message = { failed: 'Oops!!! I got wrong user details' };
      helper.messageResponder(res, false, message, 400);
    }
  }

  function updateUserData(resposeObj, newUserInfo, userId) {
    userModel.updateOneUser(newUserInfo, userId, function(bool, message) {
      helper.dataResponder(resposeObj, bool, message, 'user', 400);
    });
  }

  module.exports = {
    signUp: function(req, res) {
      var formatedUserObject = helper.validateUserData(req.body, true);
      if (formatedUserObject.bool.value) {
        saveUser(res, formatedUserObject.data);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    authenticateUser: function(req, res, next) {
      var token = req.body.token || req.query.token || req.headers.token;
      if (token) {
        auth.verifyToken(req, res, next, token);
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
        validateAndCheckUser(res, userData);
      } else {
        var result = { failed: 'Invalid User Data.' };
        helper.messageResponder(res, false, result, 400);
      }
    },
    editUser: function(req, res) {
      var formatedUserObject = helper.validateUserData(req.body, false);
      if (formatedUserObject.bool.value) {
        updateUserData(res, formatedUserObject.data, req.params.id);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    deleteUser: function(req, res) {
      if (req.params.id.isNumber()) {
        removeUser(res, req.params.id);
      } else {
        var message = { failed: 'Invalid document id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getOneUsers: function(req, res) {
      var id = req.params.id;
      if (id.isNumber()) {
        userModel.findUsers({ _id: id }, function(bool, message) {
          helper.dataResponder(res, bool, message[0], 'user', 204);
        });
      } else {
        var message = { failed: 'Invalid document id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getAllUsers: function(req, res) {
      userModel.findUsers({}, function(bool, result) {
        helper.dataResponder(res, bool, result, 'user', 204);
      });
    }
  };

})();
