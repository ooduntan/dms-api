var userService = require('../service/userService');
var docService = require('../service/docService');
require('./stringClass');

module.exports = {

  userRequirement: ['firstname', 'lastname'],
  loginData: ['username', 'password'],
  docRequirement: ['title'],
  formatedData: {},
  nameObject: {},
  validateData: function(requiredData, data, allField) {
    var objectArray = Object.keys(data);
    var requiredCounter = 0;

    for (var key = 0; key < objectArray.length; key++) {
      if (this.formatUserData(objectArray[key], data[objectArray[key]])) {
        requiredCounter += this.checkIfRequired(requiredData, objectArray[key]);
      } else {
        return false;
      }
    }

    this.mergeNameObj();
    return this.requiredLength(requiredCounter, requiredData, allField);
  },
  formatUserData: function(key, value) {
    if (key === 'email' && value.verifyEmail()) {
      this.formatedData.email = value;
      return true;
    } else if ((key === 'firstname' || key === 'lastname') && value.isValidWord()) {
      this.nameObject[key] = value;
      return true;
    } else if (value.isValidWord()) {
      this.formatedData[key] = value;
      return true;
    }

    return false;
  },
  requiredLength: function(dataChecker, requiredData, allField) {
    if (allField) {
      return dataChecker === requiredData.length ? true : false;
    }
    return true;
  },
  mergeNameObj: function() {
    if (Object.keys(this.nameObject).length > 0) {
      this.formatedData.name = this.nameObject;
    }
    this.nameObject = {};
  },
  checkIfRequired: function(requirement, objectKey) {
    if (requirement.indexOf(objectKey) > -1) {
      return 1;
    }
    return 0;
  },
  formatAndSaveData: function(userData, cb) {
    if (this.validateData(this.userRequirement, userData, true)) {
      return userService.saveUserData(this.formatedData, cb);
    } else {
      cb(false, 'I got an Invalid data set');
    }
  },
  formatAndSaveDoc: function(docData, cb) {
    if (this.validateData(this.docRequirement, docData, true)) {
      return docService.saveDoc(this.formatedData, cb);
    } else {
      cb(false, 'I got');
    }
  }

};
