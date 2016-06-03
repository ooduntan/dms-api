(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var roleModel = require('../models/roleModels');

  function saveUserRole(responseObj, roleData) {
    roleModel.saveRole(roleData.role, function(bool, result) {
      var message = { success: 'Saved Successfully', failed: result };
      helper.messageResponder(responseObj, bool, message, 401);
    });
  }

  function updateRoleCollections(responseObj, roleData, roleId) {
    var roleQuery = { role: roleData };
    roleModel.updateRole(roleQuery, roleId, function(bool, message) {
      if (message === null) {
        bool = false;
        message = { failed: 'User does not exist' };
      }
      helper.messageResponder(responseObj, bool, message, 401);
    });
  }

  function removeRole(responseObj, roleId) {
    roleModel.findAndRemoveRole({ _id: roleId }, function(bool, message) {
      helper.dataResponder(responseObj, bool, message, 'doc', 401);
    });
  }

  module.exports = {
    createRole: function(req, res) {
      var formatedData = helper.formatRoleData(req.body);
      if (formatedData.bool.value) {
        saveUserRole(res, formatedData.data);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getAllrole: function(req, res) {
      roleModel.getRoles({}, function(bool, rolesData) {
        helper.dataResponder(res, bool, rolesData, 'roles', 204);
      });
    },
    editRole: function(req, res) {
      var formatedData = helper.formatRoleData(req.body);
      if (formatedData.bool.value) {
        updateRoleCollections(res, req.body.role, req.params.id);
      } else {
        var message = { failed: 'Invalid data!!!' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    deleteRole: function(req, res) {
      if (req.params.id.isNumber()) {
        removeRole(res, req.params.id);
      } else {
        var message = { failed: 'Invalid user id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    getOneRole: function(req, res) {
      roleModel.getRoles({ _id: req.params.id }, function(bool, role) {
        if (bool) {
          helper.dataResponder(res, bool, role, 'role', 204);
        } else {
          var message = { failed: 'Document does not exist' };
          helper.messageResponder(res, false, message, 400);
        }
      });
    }
  };

})();
