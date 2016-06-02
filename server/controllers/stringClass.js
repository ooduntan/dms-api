String.prototype.verifyEmail = function() {
  return /\S+@\S+\.\S+/g.test(this);
};
String.prototype.isValidWord = function() {
  return !/[^\w -]/.test(this.trim());
};
String.prototype.isNumber = function() {
  return !/\D/.test(this);
};

module.exports = String;
