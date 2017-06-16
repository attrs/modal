var base = require('./base.js');
var shell = require('./shell.js');

var buildoptions = function(arg) {
  var message = arg[0];
  var title = arg[1];
  var done = arg[2];
  var options = {};
  
  if( typeof message == 'string' )
    options.message = message;
  else if( message && typeof message == 'object' )
    for(var k in message) options[k] = message[k];
  
  if( typeof title == 'string' )
    options.title = title;
  else if( typeof title == 'function' )
    options.ondone = title;
  
  if( typeof done == 'function' ) options.ondone = done;
  
  return options;
};

var alert = function() {
  var options = buildoptions(arguments);
  var shell = Shell({
    title: options.title,
    message: options.message
  })
  
  base.open({
    el: shell
  }, function(err, handle) {
    
  });
};

var confirm = function() {
  var options = buildoptions(arguments);
  
};

var prompt = function() {
  var options = buildoptions(arguments);
  
};

var success = function() {
  var options = buildoptions(arguments);
  
};

var error = function() {
  var options = buildoptions(arguments);
  
};

var warning = function() {
  var options = buildoptions(arguments);
  
};


alert.confirm = confirm;
alert.prompt = prompt;
alert.success = success;
alert.error = error;
alert.warning = warning;

module.exports = alert;