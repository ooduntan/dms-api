(function() {
  'use strict';
  /**
   * addDays-- Add days to a date object
   * @param Date {A Data with the specified day added}
   */
  Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));

    return this;
  };

}());
