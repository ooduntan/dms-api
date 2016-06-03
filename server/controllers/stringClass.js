String.prototype.verifyEmail = function() {
  return /\S+@\S+\.\S+/g.test(this);
};
String.prototype.isValidWord = function() {
  return !/[^\w -]/.test(this.trim());
};
String.prototype.isNumber = function() {
  return !/\D/.test(this);
};
String.prototype.isSentence = function() {
  return !/[^a-z0-9\-\_ ]/i.test(this);
};

module.exports = String;
