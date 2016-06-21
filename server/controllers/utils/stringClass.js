(function() {
  'use strict';

  /**
   * verifyEmail -- verify if the string has a correct email format
   * @return Boolean TURE if the string has a correct email format
   * FALSE otherwise
   */
  String.prototype.verifyEmail = function() {
    return /\S+@\S+\.\S+/g.test(this);
  };

  /**
   * isValidName -- Verify if a string is a valid name 
   * i.e it doesnt contain charaters not found in names
   * @return Boolean 
   */
  String.prototype.isValidName = function() {
    return !/[^\w -]/.test(this.trim());
  };

  /**
   * isUserName-- Verify if a string is a valid username
   * i.e it doesnt contain unwanted charater
   * @return Boolean
   */
  String.prototype.isUserName = function() {
    return !/[^\w-\_\.]/.test(this.trim());
  };

  /**
   * isNumber-- Verify is a string contain only numbers
   * @return Boolean
   */
  String.prototype.isNumber = function() {
    return !/\D/.test(this);
  };

  /**
   * isSentence-- Verify if a string contain multiple words with
   * no unwanted character
   * @return Boolean
   */
  String.prototype.isSentence = function() {
    return !/[^a-z0-9\-\_ ]/i.test(this);
  };

  /**
   * trimWordEx -- Removes wihte spaces within and at the edges of a sentences
   * @return String [A sentences separated with a single space]
   */
  String.prototype.trimWordEx = function() {
    return this.trim().replace(/\s+/g, '');
  };

  module.exports = String;

}());
