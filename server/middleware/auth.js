(function() {
  'use strict';

  var jwt = require('jsonwebtoken');
  var config = require('../../config');
  var userService = require('../service/userService');
  var helper = require('../controllers/helperFiles/controllerHelper');

  module.exports = {

    /**
     * verifyToken - Check if user token is valid
     * @param  {Object}   req   [The server request Object]
     * @param  {Object}   res   [The server response Object]
     * @param  {String}   token [The user token]
     * @param  {Function} next  [The middleware next function]
     */
    verifyToken: function(req, res, token, next) {
      var _this = this;

      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          var message = { failed: 'Invalid token' };

          helper.messageResponder(res, false, message, 403);
        } else {
          var query = { _id: decoded.user._id };

          userService.findUsers(query, function(bool, userData) {
            _this.checkUsers(userData, res, req, decoded, next);
          });
        }
      });
    },

    /**
     * checkUsers Checks the token data
     * @param  {Object}   userData [Userdata from the token]
     * @param  {Object}   res      [The server request Object]
     * @param  {Object}   req      [The server response Object]
     * @param  {Object}   decoded  [The data decoded from token]
     * @param  {Function} next     [The middleware next function]
     */
    checkUsers: function(userData, res, req, decoded, next) {
      if (userData.length > 0) {
        req.decoded = decoded;
        next();
      } else {
        var message = { failed: 'Invalid token' };

        helper.messageResponder(res, false, message, 403);
      }
    },

    /**
     * createToken - Create a JWT token
     * @param  {Object} userInfo [User data]
     * @return {String}          [A JWT encoded data]
     */
    createToken: function(userInfo) {
      return jwt.sign({ user: userInfo }, config.secret, { expiresIn: '7d' });
    }
  };

}());
