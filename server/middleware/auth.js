var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = {
  verifyToken: function(req, res, next, token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  },
  createToken: function(userInfo) {
    console.log(userInfo);
    return jwt.sign({ user: userInfo }, config.secret, { expiresIn: '7d' });
  }
};
