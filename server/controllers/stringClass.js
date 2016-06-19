(function() {
  'use strict';
  String.prototype.verifyEmail = function() {
    return /\S+@\S+\.\S+/g.test(this);
  };
  String.prototype.isValidName = function() {
    return !/[^\w -]/.test(this.trim());
  };
  String.prototype.isUserName = function() {
    return !/[^\w-\_\.]/.test(this.trim());
  };
  String.prototype.isNumber = function() {
    return !/\D/.test(this);
  };
  String.prototype.isSentence = function() {
    return !/[^a-z0-9\-\_ ]/i.test(this);
  };

  /**
   * [trimWordEx -- Removes wihte spaces within and at the edges of a sentences]
   * @return {String} [A sentences separated with a single space]
   */
  String.prototype.trimWordEx = function() {
    return this.trim().replace(/\s+/g, '');
  };

  module.exports = String;

}());
