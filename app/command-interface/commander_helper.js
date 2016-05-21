var inquirer = require('inquirer');
var userController = require('../controllers/users/userController');

var validator = {
  password: '',
  notEmpty: function(value) {
    if (value.trim().length !== 0) {
      return true;
    } else {
      return 'Please enter a valid value';
    }
  },
  pwCheck: function(value) {
    if (value.trim().length < 8) {
      return 'Password needs to be greater than 8 characters long';
    } else if (!/\d/.test(value.trim()) || !/\W/.test(value.trim())) {
      return 'Password needs both digits and non-alphanumeric characters';
    } else if (!/[A-Z]/.test(value.trim()) || !/[a-z]/.test(value.trim())) {
      return 'Password needs both upper and lower case letters';
    } else {
      this.password = value;
      return true;
    }
  },
  confirmPassword: function(value) {
    if (value === password) {
      return true;
    } else {
      return 'Confirmation needs to match password entered';
    }
  },
  emailCheck: function(email) {
    if ((/^\S+@\S+\.\S+$/).test(email)) {
      return true;
    } else {
      return "Please enter a valid email address";
    }
  },
  formatOutput: function(err, res) {
    if (res) {
      con.log("Welcome to Document Managment System!!!");
    }
  }
};

var commands = {
  loginData: [{
    type: 'input',
    name: 'username',
    message: 'Username: ',
  }, {
    type: 'password',
    name: 'password',
    message: 'Password: ',
  }],
  createData: [{
    type: 'input',
    name: 'firstname',
    message: 'What\'s your first name? ',
  }, {
    type: 'input',
    name: 'lastname',
    message: 'What\'s your last name? ',
  }, {
    type: 'input',
    name: 'email',
    message: 'What\'s your email? ',
  }, {
    type: 'input',
    name: 'username',
    message: 'What username would you like? ',
  }, {
    type: 'password',
    name: 'password',
    message: 'Enter a password: ',
  }, {
    type: 'password',
    name: 'confirmPw',
    message: 'Confirm your password: ',
  }, {
    type: 'checkbox',
    message: 'Role: ',
    name: 'role',
    choices: [{
      name: 'User',
      checked: true
    }, {
      name: 'Admin'
    }, ],
  }]
};

module.exports = {
  command: function(action, commandProperty, context, commandArgument, options, callback) {
    if (Object.keys(commandArgument.options).length < 1) {
      return context.prompt(commands[commandProperty], userController[action]);
    } else {
      this.argumentAction(commandArgument, action, context, options, callback);
    }
  },
  argumentAction: function(commandArgument, action, context, options, callback) {
    if (Object.keys(commandArgument.options).length === options) {
      context.log(commandArgument);
      callback();
    } else {
      context.log('Invalid Command use -h to get help');
      callback();
    }
  }
};
