(function() {
  'use strict';

  var helper = require('./helperFiles/controllerHelper');
  var roleService = require('../service/roleService');
  var roleHelper = require('./helperFiles/roleHelper');

  module.exports = {

    /**
     * createRole -- Create a new role in the database
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    createRole: function(req, res) {
      helper.validateRoles(req.body, function(bool, formatedRoleData) {
        var errorMessage = 'Invalid role name';

        helper.saveDataHandler(res, bool, formatedRoleData,
          roleHelper.saveUserRole, errorMessage);
      });
    },

    /**
     * getAllrole -- Get all the role in the database
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    getAllrole: function(req, res) {
      var searchQuery = {};

      helper.getData(res, searchQuery, roleService.getRoles, 'roles');
    },

    /**
     * editRole - Handles the put request to edit a role
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     */
    editRole: function(req, res) {
      helper.validateRoles(req.body, function(bool, validData) {
        var roleId = req.params.id;

        if (bool && typeof(validData) === 'object') {
          roleHelper.updateRoleCollections(res, validData.role, roleId);
        } else {
          var message = { failed: 'Invalid data!!!' };

          helper.messageResponder(res, false, message, 400);
        }
      });
    },

    /**
     * deleteRole -- Delete a role from the database 
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @return Mixed     [Boolean and a String of the result]
     */
    deleteRole: function(req, res) {
      if (req.params.id.isNumber() && req.params.id !== '1') {
        roleHelper.removeRole(res, req.params.id);
      } else {
        var message = { failed: 'Invalid role id' };

        helper.messageResponder(res, false, message, 400);
      }
    },

    /**
     * getOneRole -- Get a role by its ID
     * @param  Object   req  [the request object]
     * @param  Object   res  [the response object]
     * @return Mixed     [Boolean and an Object/String of the result]
     */
    getOneRole: function(req, res) {
      roleService.getRoles({ _id: req.params.id }, function(bool, role) {
        helper.dataResponder(res, bool, role[0], 'role', 402);
      });
    }
  };

}());
