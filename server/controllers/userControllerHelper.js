(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var userService = require('../service/userService');
  var auth = require('../middleware/auth');
  var encrypt = require('../middleware/security');

  module.exports = {
    saveUser: function(responseObject, userData) {
      userService.saveUser(userData, function(bool, message) {
        var result = { success: message, failed: message };
        helper.messageResponder(responseObject, bool, result, 401);
      });
    },

    verifyUser: function(responseObj, userData) {
      var search = { username: userData.username };
      var _this = this;

      userService.findUsers(search, function(bool, result) {
        if (result.length > 0) {
          _this.compareEncryptedPass(responseObj, userData.password, result[0]);
        } else {
          var message = { failed: 'Oops!!! Invalid Username/Password' };
          helper.messageResponder(responseObj, false, message, 400);
        }
      });
    },
    compareEncryptedPass: function(responseObj, pass, userData) {

      encrypt.comparePass(pass, userData.password, function(isMatched) {
        if (isMatched) {
          var token = auth.createToken(userData);
          helper.dataResponder(responseObj, isMatched, token, 'token', 402);
        } else {
          var result = { failed: 'Oops!!! Invalid Username/Password' };
          helper.messageResponder(responseObj, isMatched, result, 400);
        }
      });
    },
    removeUser: function(responseObj, id) {
      userService.deleteUserById(id, function(bool, message) {
        helper.dataResponder(responseObj, bool, message, 'user', 401);
      });
    },
    validateAndCheckUser: function(respondObj, userData) {
      var cleanUserData = helper.validatAndFormatData(userData, false);
      if (cleanUserData.bool.value) {
        this.verifyUser(respondObj, cleanUserData.data);
      } else {
        var message = { failed: 'Oops!!! I got wrong user details' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    updateUserData: function(resposeObj, newUserInfo, userId) {
      if (newUserInfo.password !== undefined) {
        userService.encryptAndUpdateData(newUserInfo, userId,
          function(bool, message) {
            helper.dataResponder(resposeObj, bool, message, 'user', 400);
          });
      } else {
        userService.findAndUpdateOneUser(newUserInfo, userId,
          function(bool, message) {
            helper.dataResponder(resposeObj, bool, message, 'user', 400);
          });
      }
    }
  };

})();
