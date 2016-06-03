var modelAsset = require('./modelPrerequisite');
modelAsset.initIncrement();

var roleSchema = new modelAsset.schema({
  role: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});

modelAsset.aiPlugin(roleSchema, {
  model: 'roles',
  startAt: 1
});
var rolesCollections = modelAsset.model('roles', roleSchema);

module.exports = {
  saveRole: function(roleData, cb) {
    var roles = new rolesCollections(roleData);
    roles.save(function(err) {
      return err ? cb(false, err) : cb(true, err);
    });
  },
  getRoles: function(searchTerm, cb) {
    rolesCollections.find(searchTerm, function(err, docs) {
      return err ? cb(false, err) : cb(true, docs);
    });
  },
  deleteRole: function(docId, cb) {
    rolesCollections.remove({ _id: docId }, function(err) {
      return err ? cb(false, err) : cb(true, err);
    });
  },
  updateRole: function(roleInfo, id, cb) {
    var query = { _id: id };
    var field = { $set: roleInfo };
    var option = { new: true };

    rolesCollections.findOneAndUpdate(query, field, option, function(err, role) {
      return err ? cb(false, err) : cb(true, role);
    });
  },
  deleteRoleById: function(roleId, cb) {
    rolesCollections.remove({ _id: roleId }, function(err) {
      return err ? cb(false, err) : cb(true, err);
    });
  },
  findAndRemoveRole: function(searchTerm, cb) {
    var _this = this;
    rolesCollections.find(searchTerm, function(err, roles) {
      if (roles.length <= 0) {
        return cb(false, 'Not found');
      } else {
        _this.deleteRoleById({ _id: roles[0]._id }, cb);
      }
    });
  }
};
