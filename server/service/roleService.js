(function() {
  'use strict';
  var roles = require('../models/roleModels'),
    query = require('./query');

  module.exports = {
    saveRole: function(roleData, cb) {
      query.saveQuery(roles, roleData, cb);

      // var newRole = new roles(roleData);
      // newRole.save(function(err) {
      //   return err ? cb(false, err) : cb(true, err);
      // });
    },
    getRoles: function(searchTerm, cb) {
      query.findQuery(roles, searchTerm, cb);

      // roles.find(searchTerm, function(err, docs) {
      //   return err ? cb(false, err) : cb(true, docs);
      // });
    },
    updateRole: function(roleInfo, id, cb) {
      query.updateQuery(roles, id, roleInfo, cb);
      // var query = { _id: id };
      // var field = { $set: roleInfo };
      // var option = { new: true };

      // roles.findOneAndUpdate(query, field, option, function(err, role) {
      //   return err ? cb(false, err) : cb(true, role);
      // });
    },
    deleteRoleById: function(roleId, cb) {
      query.deleteQuery(roles, { _id: roleId }, cb);
      // roles.remove({ _id: roleId }, function(err) {
      //   return err ? cb(false, err) : cb(true, err);
      // });
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
