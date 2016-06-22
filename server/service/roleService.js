(function() {
  'use strict';
  var roles = require('../models/roleModels'),
    query = require('./query');

  module.exports = {

    /**
     * saveRole - Save new role in the db
     * @param  {Object}   roleData [The role data]
     * @param  {Function} cb       [Passes result to callback]
     */
    saveRole: function(roleData, cb) {
      query.saveQuery(roles, roleData, cb);
    },

    /**
     * getRoles - Fetches all roles
     * @param  {Object}   searchTerm [The search query]
     * @param  {Function} cb         [Passes result to callback]
     */
    getRoles: function(searchTerm, cb) {
      query.findQuery(roles, searchTerm, cb);
    },

    /**
     * updateRole - Updata a role
     * @param  {Object}   roleInfo [New role data]
     * @param  {Int}   id       [Role ID]
     * @param  {Function} cb       [Passes result to callback]
     */
    updateRole: function(roleInfo, id, cb) {
      query.updateQuery(roles, id, roleInfo, cb);
    },

    /**
     * deleteRoleById -  Delete a role
     * @param  {Int}   roleId [Role ID]
     * @param  {Function} cb     [Passes result to callback]
     */
    deleteRoleById: function(roleId, cb) {
      query.deleteQuery(roles, { _id: roleId }, cb);
    },

    /**
     * findAndRemoveRole -  Find and delete existing role
     * @param  {Object}   searchTerm [Search query]
     * @param  {Function} cb         [Passes result to callback]
     */
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
