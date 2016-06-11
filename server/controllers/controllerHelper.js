(function() {
  'use strict';
  var userService = require('../service/userService');
  var docService = require('../service/docService');
  var encrypt = require('../middleware/security');
  require('./stringClass');

  module.exports = {
    userRequirement: {
      reqiure: ['firstname', 'lastname'],
      fields: ['username', 'password', 'firstname', 'lastname', 'role', 'email']
    },
    requiredDoc: {
      reqiure: ['title'],
      fields: ['title', 'content']
    },
    roleRequirement: { require: ['role'], fields: ['role'] },
    validateData: function(requiredData, data, allField) {
      var userDataKeys = Object.keys(data);
      var requiredNum = 0;

      for (var key = 0; key < userDataKeys.length; key++) {
        if (this.validateAData(userDataKeys[key], data[userDataKeys[key]])) {
          requiredNum += this.checkIfRequired(requiredData, userDataKeys[key]);
        } else {
          return false;
        }
      }

      return this.requiredLength(requiredNum, requiredData, allField);
    },
    validateAData: function(dataType, data) {
      if (dataType === 'email') {
        return data.verifyEmail();
      } else if (dataType === 'lastname' || dataType === 'firstname') {
        return data.isValidName();
      } else {
        return data.isSentence();
      }
    },
    formatUserData: function(key, value) {
      if (key === 'firstname' || key === 'lastname') {
        this.nameObject[key] = value;
      } else {
        this.formatedData.data[key] = value;
      }
    },
    encryptPass: function(password, cb) {
      encrypt.hashPass(password, function(bool, hashedPass) {
        return bool ? cb(bool) : cb(hashedPass);
      });
    },
    requiredLength: function(dataChecker, requiredData, allField) {
      if (allField) {
        return dataChecker === requiredData.length ? true : false;
      }
      return true;
    },
    checkIfRequired: function(requirement, objectKey) {
      if (requirement.indexOf(objectKey) > -1) {
        return 1;
      }
      return 0;
    },
    validatAndFormatData: function(userData, allfield) {
      var formatedData = { data: {}, bool: { value: false } };

      if (this.validateData(this.userRequirement.reqiure, userData, allfield)) {
        formatedData.data = this.formatData(userData, this.userRequirement.fields);
        formatedData.bool.value = true;
      }

      return formatedData;
    },
    formatData: function(userData, fields) {
      var nameObj = {};
      var userObj = {};

      for (var key in fields) {
        if (userData[fields[key]] === undefined) {
          continue;
        } else if (fields[key] === 'firstname' || fields[key] === 'lastname') {
          nameObj[fields[key]] = userData[fields[key]];
        } else {
          userObj[fields[key]] = userData[fields[key]];
        }
      }

      return this.mergeData(nameObj, userObj);
    },
    mergeData: function(mergeObj, realObj) {
      if (Object.keys(mergeObj).length > 0) {
        realObj.name = mergeObj;
        return realObj;
      }
      return realObj;
    },
    validateDocData: function(docData, allfields) {
      var validatedData = { data: {}, bool: { value: false } };

      if (this.validateData(this.requiredDoc.reqiure, docData, allfields)) {
        validatedData.bool.value = true;
        validatedData.data = this.formatData(docData, this.requiredDoc.fields);
      }

      return validatedData;
    },
    validateRoles: function(roleData) {
      var validData = { data: {}, bool: { value: false } };
      if (roleData.role !== undefined && roleData.role.isSentence()) {
        validData.data.role = roleData.role;
        validData.bool.value = true;
      }

      return validData;
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

})();
