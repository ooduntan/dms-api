(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var roleService = require('../../service/roleService');

  module.exports = {

    /**
     * saveUserRole - Saves new role in the database
     * @param  {Object} responseObj [The server response object]
     * @param  {Object} roleData    [The new role data]
     */
    saveUserRole: function(responseObj, roleData) {
      roleService.saveRole(roleData, function(bool, result) {
        var message = { success: 'Saved Successfully', failed: result };
        helper.messageResponder(responseObj, bool, message, 401);
      });
    },

    /**
     * updateRoleCollections - Updata role data 
     * @param  {Object } responseObj [The server response object]
     * @param  {Object} roleData    [The new role data]
     * @param  {Int} roleId      [The role ID]
     */
    updateRoleCollections: function(responseObj, roleData, roleId) {
      var roleQuery = { role: roleData };
      var roleIdQuery = { _id: roleId };

      roleService.updateRole(roleQuery, roleIdQuery, function(bool, message) {
        if (message === null) {
          bool = false;
          message = { failed: 'role does not exist' };
        }
        helper.dataResponder(responseObj, bool, message, 'role', 401);
      });
    },

    /**
     * removeRole - Removes a role 
     * @param  {Object} responseObj [The server response object]
     * @param  {Int} roleId      [The role ID]
     */
    removeRole: function(responseObj, roleId) {
      roleService.findAndRemoveRole({ _id: roleId }, function(bool, message) {
        helper.dataResponder(responseObj, bool, message, 'role', 401);
      });
    }
  };

}());
