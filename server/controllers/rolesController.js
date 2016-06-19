(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var roleService = require('../service/roleService');
  var roleHelper = require('./roleHelper');

  module.exports = {
    createRole: function(req, res) {
      helper.validateRoles(req.body, function(bool, formatedRoleData) {
        var errorMessage = 'Invalid role name';
        helper.saveDataHandler(res, bool, formatedRoleData,
          roleHelper.saveUserRole, errorMessage);
      });
    },
    getAllrole: function(req, res) {
      helper.getData(res, roleService.getRoles, 'roles');
    },
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
    deleteRole: function(req, res) {
      if (req.params.id.isNumber() && req.params.id !== '1') {
        roleHelper.removeRole(res, req.params.id);
      } else {
        var message = { failed: 'Invalid role id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getOneRole: function(req, res) {
      roleService.getRoles({ _id: req.params.id }, function(bool, role) {
        helper.dataResponder(res, bool, role[0], 'role', 402);
      });
    }
  };

}());
