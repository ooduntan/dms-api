var UserRolesCtrl = require('../controllers/userRoles');

module.exports = function(api) {
  api.post('/user-role', UserRolesCtrl.create);
  api.get('/user-role', UserRolesCtrl.getAllRoles);
  api.get('/user-role/:role', UserRolesCtrl.getUserRole);
  api.delete('/user-role/:role', UserRolesCtrl.removeRole);
  api.put('/user-role/:role', UserRolesCtrl.update);
  return api;
};
