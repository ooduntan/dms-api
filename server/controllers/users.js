(function() {
  'use strict';

  var helper = require('./helperFiles/controllerHelper'),
    auth = require('../middleware/auth'),
    userService = require('../service/userService'),
    twoWayCrypt = require('../middleware/reversibleEncrypt'),
    userHelper = require('./helperFiles/userControllerHelper');


  module.exports = {

    /**
     * signUp-- Validate user data and create a new user
     * if the user data is valid. 
     * @param  Object req [the request object]
     * @param  Object res [the response object]
     * @return Mixed     Returns a boolean to saveDataHandler function
     * and a formated user data if valid else it return a string
     */
    signUp: function(req, res) {
      helper.validatAndFormatData(req.body, true,
        function(bool, formatedUserData) {
          var errorMessage = 'compulsory fields Missing';

          helper.saveDataHandler(res, bool, formatedUserData,
            userHelper.saveUser, errorMessage);
        });
    },

    /**
     * authenticateUser -- Verify if the token the user provide is valid
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @param  Function next [the next fuction in express middleware]
     */
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

    /**
     * login -- Verify is a username and password provided is valid and correct
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     */
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

    /**
     * editUser -- Validate and edit userdata
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @return Mixed    [return bool and the updated user data if 
     * user data is true else it return flase]
     */
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

    /**
     * deleteUser -- Delete a user from the database.
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @return Mixed     [Bool and a string information of the action]
     */
    deleteUser: function(req, res) {
      if (req.params.id.isNumber()) {
        userHelper.removeUser(res, req.params.id);
      } else {
        var message = { failed: 'Invalid user id' };

        helper.messageResponder(res, false, message, 400);
      }
    },

    /**
     * getOneUsers -- Fetch a user by ID or USERNAME from the database
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @return Mixed     [Boolean and an Object/String of the result]
     */
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

    /**
     * getAllUsers -- Fetches all the user in the database
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @return Mixed     [Boolean and an Object/String of the result]
     */
    getAllUsers: function(req, res) {
      var searchQuery = {};

      helper.getData(res, searchQuery, userService.findUsers, 'user');
    },
    logout: function(res, req) {
      var message = { failed: 'You have logged out successfully!!!' };

      helper.messageResponder(res, false, message, 200);
    }
  };

}());
