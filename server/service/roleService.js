(function() {
  'use strict';
  var roles = require('../models/roleModels'),
    query = require('./query');

  module.exports = {
    saveRole: function(roleData, cb) {
      query.saveQuery(roles, roleData, cb);
    },
    getRoles: function(searchTerm, cb) {
      query.findQuery(roles, searchTerm, cb);
    },
    updateRole: function(roleInfo, id, cb) {
      query.updateQuery(roles, id, roleInfo, cb);
    },
    deleteRoleById: function(roleId, cb) {
      query.deleteQuery(roles, { _id: roleId }, cb);
    },
    findAndRemoveRole: function(searchTerm, cb) {
      var _this = this;
      roles.find(searchTerm, function(err, roles) {
        if (roles.length <= 0 || err) {
          return cb(false, 'Not found');
        } else {
          _this.deleteRoleById({ _id: roles[0]._id }, cb);
        }
      });
    }
  };

}());
