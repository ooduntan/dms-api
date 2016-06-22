(function() {
  'use strict';

  var mongoose = require('mongoose');
  var roleObj = require('../service/roleService');

  var defaultRoles = [
    { role: 'viewer' },
    { role: 'moderator' },
    { role: 'Admin' }
  ];

  roleObj.getRoles({}, function(bool, roles) {
    if (roles.length <= 0) {
      defaultRoles.forEach(function(element, index) {
        roleObj.saveRole(element, function(bool, message) {
          if (bool) {
            console.log('success!');
          }
        });
      });
    }

    process.exit(0);

  });

}());
