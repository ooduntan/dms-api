var modelAsset = require('./modelPrerequisite');
modelAsset.initIncrement();

var UserSchema = new modelAsset.schema({
  name: {
    firstname: {
      type: String,
      trim: true,
      required: true
    },
    lastname: {
      type: String,
      trim: true,
      required: true
    }
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: 1,
  }
});

modelAsset.aiPlugin(UserSchema, {
  model: 'users',
  startAt: 1
});
var UserCollection = modelAsset.model('users', UserSchema);

module.exports = {
  saveUser: function(userData, cb) {
    var user = new UserCollection(userData);
    user.save(function(err) {
      return err ? cb(false, err) : cb(true, err);
    });
  },
  findUsers: function(searchTerm, cb) {
    UserCollection.find(searchTerm, function(err, user) {
      return err ? cb(false, err) : cb(true, user);
    });
  },
  deleteUserById: function(userId, cb) {
    UserCollection.remove({ _id: userId }, function(err) {
      return err ? cb(err, false) : cb('', true);
    });
  },
  updateOneUser: function(userInfo, id, cb) {
    var query = { _id: id };
    var field = { $set: userInfo };
    var option = { new: true };
    UserCollection.findOneAndUpdate(query, field, option, function(err, user) {
      return err ? cb(false, err) : cb(true, user);
    });
  }
};
