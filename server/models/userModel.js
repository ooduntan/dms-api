var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
  name: {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

var userCollection = mongoose.model('users', userSchema);

module.exports = {
  saveUser: function(userData, cb) {
    var user = new userCollection(userData);
    user.save(function(err) {
      return err ? cb(false, err) : cb(true, err);
    });
  },
  findUsers: function(id, cb) {
    if (id) {
      userCollection.findOne({ username: id }, function(err, user) {
        return err ? cb(false, err) : cb(true, user);
      });
    } else {
      var columns = 'name email username role';
      userCollection.find({}, columns, function(err, users) {
        return err ? cb(false, err) : cb(true, users);
      });
    }
  }
};
