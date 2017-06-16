var base = require('./base.js');
var modal = require('./modal.js');
var popup = require('./popup.js');
var spinner = require('./spinner.js');

base.modal = modal;
base.spinner = spinner;
base.popup = popup;

base.alert = function(options, done) {
  modal.apply(modal, arguments);
  return this;
};

base.prompt = function() {
  modal.prompt.apply(modal, arguments);
  return this;
};

base.confirm = function(options, done) {
  modal.confirm.apply(modal, arguments);
  return this;
};

base.error = function(title, err, done) {
  modal.error.apply(modal, arguments);
  return this;
};

base.warning = function(title, err, done) {
  modal.warning.apply(modal, arguments);
  return this;
};

base.success = function(msg, done) {
  modal.success.apply(modal, arguments);
  return this;
};


module.exports = base;