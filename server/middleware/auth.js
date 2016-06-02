var jwt = require('jsonwebtoken');
var config = require('../../config');
var userService = require('../service/userService');

module.exports = {
  verifyToken: function(req, res, next, token) {
    var _this = this;
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid token.'
        });
      } else {
        var query = { _id: decoded.user._id };
        userService.getUsers(query, function(bool, userData) {
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
      return res.json({
        success: false,
        message: 'Invalid User token.'
      });
    }
  },
  createToken: function(userInfo) {
    console.log(userInfo);
    return jwt.sign({ user: userInfo }, config.secret, { expiresIn: '7d' });
  }
};
