(function() {
  'use strict';
  var roles = require('../models/roleModels');

  module.exports = {
    saveRole: function(roleData, cb) {
      var newRole = new roles(roleData);
      newRole.save(function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    getRoles: function(searchTerm, cb) {
      roles.find(searchTerm, function(err, docs) {
        return err ? cb(false, err) : cb(true, docs);
      });
    },
    deleteRole: function(docId, cb) {
      roles.remove({ _id: docId }, function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    updateRole: function(roleInfo, id, cb) {
      var query = { _id: id };
      var field = { $set: roleInfo };
      var option = { new: true };

      roles.findOneAndUpdate(query, field, option, function(err, role) {
        return err ? cb(false, err) : cb(true, role);
      });
    },
    deleteRoleById: function(roleId, cb) {
      roles.remove({ _id: roleId }, function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
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
