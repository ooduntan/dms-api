(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var roleService = require('../service/roleService');

  module.exports = {

    saveUserRole: function(responseObj, roleData) {
      roleService.saveRole(roleData, function(bool, result) {
        var message = { success: 'Saved Successfully', failed: result };
        helper.messageResponder(responseObj, bool, message, 401);
      });
    },

    updateRoleCollections: function(responseObj, roleData, roleId) {
      var roleQuery = { role: roleData };
      var roleIdQuery = { _id: roleId };
      roleService.updateRole(roleQuery, roleIdQuery, function(bool, message) {
        if (message === null) {
          bool = false;
          message = { failed: 'role does not exist' };
        }
        helper.messageResponder(responseObj, bool, message, 401);
      });
    },

    removeRole: function(responseObj, roleId) {
      roleService.findAndRemoveRole({ _id: roleId }, function(bool, message) {
        helper.dataResponder(responseObj, bool, message, 'role', 401);
      });
    }
  };
}());
