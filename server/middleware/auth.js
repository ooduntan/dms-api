(function() {
  'use strict';
  var jwt = require('jsonwebtoken');
  var config = require('../../config');
  var userService = require('../service/userService');
  var helper = require('../controllers/controllerHelper');

  module.exports = {
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

    checkUsers: function(userData, res, req, decoded, next) {
      if (userData.length > 0) {
        req.decoded = decoded;
        next();
      } else {
        var message = { failed: 'Invalid token' };
        helper.messageResponder(res, false, message, 403);
      }
    },
    createToken: function(userInfo) {
      return jwt.sign({ user: userInfo }, config.secret, { expiresIn: '7d' });
    }
  };

}());
