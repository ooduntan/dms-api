String.prototype.verifyEmail = function() {
  return /\S+@\S+\.\S+/g.test(this);
};
String.prototype.isValidWord = function() {
  return !/[^\w]/.test(this.trim());
};

module.exports = String;
