(function() {
  'use strict';

  var userService = require('../../service/userService'),
    docService = require('../../service/docService'),
    roleService = require('../../service/roleService'),
    encrypt = require('../../middleware/security');

  module.exports = {

    /**
     * userRequirement -- An object of the compulsory and required userdata
     */
    userRequirement: {
      reqiure: ['firstname', 'lastname', 'username', 'password'],
      fields: ['username', 'password', 'firstname', 'lastname', 'role', 'email']
    },

    /**
     * requiredDoc  An object of the compulsory and required documents
     */
    requiredDoc: {
      reqiure: ['title'],
      fields: ['title', 'content', 'access']
    },

    /**
     * roleRequirement  An object of the compulsory and required roles
     */
    roleRequirement: { require: ['role'], fields: ['role'] },

    /**
     * validateData -- Its check if data sent to it is valid.
     * @param  {Array} requiredData -- An array of the fields to validate
     * @param  {Object} data      -- Data to validate
     * @param  {Boolean} allField  -- TRUE if all the fields are 
     *                              compulsory else false 
     * @return {Boolean}        --  Returns true and  the valid data else false
     */
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

    /**
     * messageResponder -- Helps send a response message to the client 
     * @param  {Object} res      [Response Object]
     * @param  {Boolean} bool     [The status of the response message]
     * @param  {String} result   [The message to display]
     * @param  {Int} httpCode [The http status the response is false]
     */
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

    /**
     * dataResponder Sends a response with a data object to the client
     * @param  {Object} res        [The response Object]
     * @param  {Boolean} bool       [The status of the response]
     * @param  {Object} result     [The result of the response]
     * @param  {String} resultName [The json property of the result]
     * @param  {Int} httpCode   [The HTTP status of the response if  false]
     */
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

    /**
     * saveDataHandler -- Help save data in the data in the db
     * @param  {Object} responseObj      [The response Object]
     * @param  {Boolean} result           [The status of the data. i.e if valid]
     * @param  {Object} formatedUserData [The user data]
     * @param  {Function} helperMethod     [The function that will be used 
     * to save the data]
     * @param  {String} errorMessage     [Error message from validation]
     */
    saveDataHandler: function(responseObj, result, formatedUserData,
      helperMethod, errorMessage) {
      if (result && typeof(formatedUserData) === 'object') {
        helperMethod(responseObj, formatedUserData);
      } else {
        var message = { failed: errorMessage };
        this.messageResponder(responseObj, false, message, 400);
      }
    },

    /**
     * getData -- Get data from the database
     * @param  {Object} responseObj  [The response object]
     * @param  {Object} searchQuery  [The query for search]
     * @param  {Function} searchMethod [The function used for search]
     * @param  {String} title        [Title of the result]
     */
    getData: function(responseObj, searchQuery, searchMethod, title) {
      var _this = this;

      searchMethod(searchQuery, function(bool, result) {
        _this.dataResponder(responseObj, bool, result, title, 404);
      });
    },

    /**
     * validateAData -- Check if a data is valid
     * @param  {String} dataType [The type of the data you want to validate]
     * @param  {String} data     [The data you want to validate]
     * @return {Boolean}          [True if valid false otherwise]
     */
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

    /**
     * encryptPass Helps encrypt password
     * @param  {String}  password [Password to be encrypted]
     * @param  {Function} cb       [Passes the hashed data to the callback]
     */
    encryptPass: function(password, cb) {
      encrypt.hashPass(password, function(bool, hashedPass) {
        return bool ? cb(bool) : cb(hashedPass);
      });
    },

    /**
     * requiredLength -- Compares the required field and the fields in the data
     * @param  {Int} userFields  [The number of compulsory fields]
     * @param  {Array} requiredData [The array of the required data]
     * @param  {Boolean} allField     [True if all the field are required]
     * @return {Boolean}              [True if the user has sent the correct 
     * data false other wise]
     */
    requiredLength: function(userFields, requiredData, allField) {
      if (allField) {
        return userFields === requiredData.length ? true : false;
      }

      return true;
    },

    /**
     * checkIfRequired -- Help check if a value is required
     * @param  {Array} requirement [An array of the required fields]
     * @param  {String} objectKey   [The name of the field]
     * @return {Int}             [1 if teh key exist 0 otherwise]
     */
    checkIfRequired: function(requirement, objectKey) {
      if (requirement.indexOf(objectKey) > -1) {
        return 1;
      }

      return 0;
    },

    /**
     * validatAndFormatData - Help validate and formate data
     * @param  {Object}   userData [The data to be validated]
     * @param  {Boolean}   allfield [True if all the fields are compulsory]
     * @param  {Function} cb       [Pass result to the callback]
     */
    validatAndFormatData: function(userData, allfield, cb) {

      if (this.validateData(this.userRequirement.reqiure, userData, allfield)) {
        var formatedData = this.formatData(userData,
          this.userRequirement.fields);
        cb(true, formatedData);
      } else {
        return cb(false, 'compulsory fields Missing');
      }
    },

    /**
     * formatData - Help format data
     * @param  {Object} userData [The user data]
     * @param  {Object} fields   [The required data object]
     * @return {Mix}          [Returns the result of the mergeData function]
     */
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

    /**
     * mergeData - Merges firstname and lastname into name object
     * @param  Object mergeObj [The first and last name object]
     * @param  {Object} realObj  [Object to merge into]
     * @return {Object}          [return the realObj]
     */
    mergeData: function(mergeObj, realObj) {

      if (Object.keys(mergeObj).length > 0) {
        realObj.name = mergeObj;
        return realObj;
      }

      return realObj;
    },

    /**
     * vierifyRole - Verify if a given role is valid
     * @param  {Object}   validatedData [A user valid data]
     * @param  {Function} cb            [Passes result to callback]
     */
    vierifyRole: function(validatedData, cb) {
      if (validatedData.access !== undefined) {
        this.checkRole(validatedData, cb);
      } else {
        cb(true, validatedData);
      }
    },

    /**
     * makeQuery - Helps make search query
     * @param  {Object} accessDataArray [User search parameter]
     * @return {Object}                 [Returns the search query]
     */
    makeRoleQuery: function(accessDataArray) {
      var result = [];
      accessDataArray.forEach(function(element, index) {
        result.push({ _id: element.trim() });
      });

      return result;
    },

    /**
     * checkRole - Check if a role is valid 
     * @param  {Object}   userData [Data sent by client]
     * @param  {Function} cb       [Passes result with callback]
     * @return {Function}            [Return Callback]
     */
    checkRole: function(userData, cb) {
      var rolesArray = userData.access.trimWordEx().split(',');
      var query = this.makeRoleQuery(rolesArray);

      roleService.getRoles({ $or: query }, function(bool, data) {
        if (bool && data.length === rolesArray.length) {
          userData.access = rolesArray;
          cb(true, userData);
        } else {
          return cb(false, 'One or more roles does not exist');
        }
      });
    },

    /**
     * validateRoles Check if role data is a valid data
     * @param  {Object}   roleData [Role data]
     * @param  {Function} cb       [Passes result to callback]
     */
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
