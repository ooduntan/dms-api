(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var userService = require('../service/userService');
  var auth = require('../middleware/auth');

  module.exports = {
    createDoc: function(req, res) {
      console.log(req.body);
      helper.formatAndSaveDoc(req.body, function(result, error) {
        if (result) {
          res.json({
            success: true,
            message: req.body.title + ' created!'
          });
        } else {
          res.status(500).send({
            success: result,
            message: error
          });
        }
      });
    },
    getDoc: function(req, res) {
      var id = req.params.username || false;
      docProcessor.getUsers(id, function(result, docData) {
        if (result) {
          res.json({ users: docData });
        } else {
          res.json({
            message: 'An error occurued while getting the list of users',
            error: docData
          });
        }
      });
    }
  };

})();
