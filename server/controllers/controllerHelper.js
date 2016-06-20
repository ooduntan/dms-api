(function() {
  'use strict';

  var userService = require('../service/userService'),
    docService = require('../service/docService'),
    roleService = require('../service/roleService'),
    encrypt = require('../middleware/security');

  module.exports = {
    userRequirement: {
      reqiure: ['firstname', 'lastname', 'username', 'password'],
      fields: ['username', 'password', 'firstname', 'lastname', 'role', 'email']
    },
    requiredDoc: {
      reqiure: ['title'],
      fields: ['title', 'content', 'access']
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
    },
    saveDataHandler: function(responseObj, result, formatedUserData,
      helperMethod, errorMessage) {
      if (result && typeof(formatedUserData) === 'object') {
        helperMethod(responseObj, formatedUserData);
      } else {
        var message = { failed: errorMessage };
        this.messageResponder(responseObj, false, message, 400);
      }
    },
    getData: function(responseObj, searchQuery, searchMethod, title) {
      var _this = this;
      searchMethod(searchQuery, function(bool, result) {
        _this.dataResponder(responseObj, bool, result, title, 404);
      });
    },
    validateAData: function(dataType, data) {

      if (dataType === 'email') {
        return data.verifyEmail();
      } else if (dataType === 'lastname' || dataType === 'firstname') {
        return data.isValidName();
      } else if (typeof(data) === 'string') {
        return true;
      } else {
        return false;
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
    validatAndFormatData: function(userData, allfield, cb) {

      if (this.validateData(this.userRequirement.reqiure, userData, allfield)) {
        var formatedData = this.formatData(userData,
          this.userRequirement.fields);
        cb(true, formatedData);
      } else {
        return cb(false, 'compulsory fields Missing');
      }
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
    validateDocData: function(docData, allfields, cb) {

      if (this.validateData(this.requiredDoc.reqiure, docData, allfields)) {
        var validatedData = this.formatData(docData, this.requiredDoc.fields);
        this.vierifyRole(validatedData, cb);
      } else {
        return cb(false, 'invalid data');
      }
    },
    vierifyRole: function(validatedData, cb) {
      if (validatedData.access !== undefined) {
        this.checkRole(validatedData, cb);
      } else {
        cb(true, validatedData);
      }
    },
    makeQuery: function(accessDataArray) {
      var result = [];
      accessDataArray.forEach(function(element, index) {
        result.push({ _id: element.trim() });
      });

      return result;
    },
    checkRole: function(userData, cb) {
      var rolesArray = userData.access.trimWordEx().split(',');
      var query = this.makeQuery(rolesArray);
      roleService.getRoles({ $or: query }, function(bool, data) {
        if (bool && data.length === rolesArray.length) {
          userData.access = rolesArray;
          cb(true, userData);
        } else {
          return cb(false, 'One or more roles does not exist');
        }
      });
    },
    validateRoles: function(roleData, cb) {
      if (roleData.role !== undefined && roleData.role.isSentence()) {
        var validateRoles = roleData;
        cb(true, validateRoles);
      } else {
        cb(false, 'Invalid Role data');
      }
    }
  };
}());
