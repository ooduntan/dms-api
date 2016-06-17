(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var roleService = require('../service/roleService');
  var roleHelper = require('./roleHelper');

  module.exports = {
    createRole: function(req, res) {
      var formatedData = helper.validateRoles(req.body);
      if (formatedData.bool.value) {
        roleHelper.saveUserRole(res, formatedData.data);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getAllrole: function(req, res) {
      roleService.getRoles({}, function(bool, rolesData) {
        helper.dataResponder(res, bool, rolesData, 'roles', 204);
      });
    },
    editRole: function(req, res) {
      var validData = helper.validateRoles(req.body);
      var roleId = req.params.id;
      if (validData.bool.value) {
        roleHelper.updateRoleCollections(res, validData.data.role, roleId);
      } else {
        var message = { failed: 'Invalid data!!!' };
        helper.messageResponder(res, false, message, 400);
      }
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
