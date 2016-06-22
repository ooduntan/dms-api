(function() {
  'use strict';
  var modelAsset = require('./modelPrerequisite');
  var bcrypt = require('bcrypt-nodejs');

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
      sparse: true,
      trim: true,
    },
    username: {
      type: String,
      sparse: true,
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

  UserSchema.pre('save', function(next) {
    var _this = this;
    if (!_this.isModified('password')) {
      next();
    }

    bcrypt.hash(_this.password, null, null, function(err, hash) {
      if (err) {
        next(hashedPass);
      } else {
        _this.password = hash;
        next();
      }
    });
  });

  module.exports = modelAsset.model('users', UserSchema);

}());
