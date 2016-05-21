var Users = require('../models/userModel');
var mongoose = require('mongoose');

var validateUsersData = {

  signUpData: ['firstname', 'lastname', 'email', 'username', 'password', 'role'],

  loginData: ['username', 'password'],

  validateData: function(requiredData, data) {
    for (var index = 0; index < requiredData.length; index++) {
      var element = requiredData[index];
      if (data[element] === undefined || this.verifyContent(data[element])) {
        return false;
      }
    }
    //console.log('i got here');
    return this.verifyEmail(data.email);
  },

  verifyContent: function(string) {
    return /[^@\w.-]/.test(string.trim());
  },

  verifyEmail: function(email) {
    return /\S+@\S+\./g.test(email);
  },
  formatAndSaveData: function(userData, cb) {
    if (this.validateData(this.signUpData, userData)) {
      return this.saveUserData(this.formatUserData(userData), cb);
    } else {
      return false;
    }
  },

  saveUserData: function(userDataObject, cb) {
    Users.saveUser(userDataObject, cb);
  },
  getUsers: function(id, cb) {
    Users.findUsers(id, cb);
  },
  formatUserData: function(userObject) {
    return {
      name: {
        firstname: userObject.firstname,
        lastname: userObject.lastname
      },
      email: userObject.email,
      username: userObject.username,
      role: userObject.role,
      password: userObject.password
    };
  }

};

module.exports = {
  signup: function(req, res) {
    validateUsersData.formatAndSaveData(req.body, function(saveData, error) {
      if (saveData) {
        res.json({
          success: true,
          message: 'User ' + req.body.username + ' created!'
        });
      } else {
        res.status(500).send({
          success: false,
          message: 'There was an error processing you request. ' +
            'Please go thorugh the api documemntation and make sure' +
            ' you are sending the correct data.'
        });
        console.log(error);
      }
    });
  },
  getAllUsers: function(req, res) {
    validateUsersData.getUsers(false, function(result, userData) {
      if (result) {
        res.json({ users: userData });
      } else {
        res.json({
          message: 'An error occurued while getting the list of users',
          error: userData
        });
      }
    });
  }
};
