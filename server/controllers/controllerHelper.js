var userService = require('../service/userService');
var docService = require('../service/docService');
require('./stringClass');

module.exports = {

  userRequirement: ['firstname', 'lastname'],
  loginData: ['username', 'password'],
  docRequirement: ['title'],
  roleRequirement: ['role'],
  formatedData: { data: {}, bool: { value: false } },
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
      this.formatedData.data.email = value;
      return true;
    } else if ((key === 'firstname' || key === 'lastname') && value.isValidWord()) {
      this.nameObject[key] = value;
      return true;
    } else {
      this.formatedData.data[key] = value;
      return true;
    }
  },
  requiredLength: function(dataChecker, requiredData, allField) {
    if (allField) {
      return dataChecker === requiredData.length ? true : false;
    }
    return true;
  },
  mergeNameObj: function() {
    if (Object.keys(this.nameObject).length > 0) {
      this.formatedData.data.name = this.nameObject;
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
      return userService.saveUserData(this.formatedData.data, cb);
    } else {
      cb(false, 'I got an Invalid data set');
    }
  },
  formatDocData: function(docData, ownerId, allfields) {
    if (this.validateData(this.docRequirement, docData, allfields)) {
      this.formatedData.data.creator = ownerId;
      this.formatedData.bool.value = true;
      return this.formatedData;
    }
    return this.formatedData;
  },
  formatRoleData: function(roleData) {
    if (roleData.role !== undefined && roleData.role.isSentence()) {
      this.formatedData.data.role = roleData;
      this.formatedData.bool.value = true;
      return this.formatedData;
    }
    return this.formatedData;
  },
  messageResponder: function(res, bool, result, httpCode) {
    if (bool) {
      res.json({
        success: bool,
        message: result.success
      });
    } else {
      res.status(httpCode).send({
        success: bool,
        message: result.failed
      });
    }
  },
  dataResponder: function(res, bool, result, resultName, httpCode) {
    if (bool) {
      var response = {};
      response[resultName] = result;
      res.json(response);
    } else {
      res.status(httpCode).send({
        success: bool,
        message: result
      });
    }
  }

};
