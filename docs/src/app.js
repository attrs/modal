var xmodal = require('x-modal');


window.openalert = function() {
  xmodal.alert('message', 'Title', function() {
    xmodal.alert('done!');
  });
};

window.openconfirm = function() {
  xmodal.confirm('message', 'Title', function(b) {
    if( !b ) xmodal.alert('cancelled!');
    else xmodal.alert('done!');
  });
};

window.openprompt = function() {
  xmodal.prompt('message', 'Title', function(text) {
    if( text ) xmodal.alert('result: ' + text);
    else xmodal.alert('no input');
  });
};

window.openpopup = function() {
  xmodal.popup('http://google.com', function() {
    xmodal.alert('done!');
  });
};

window.opendialog = function() {
  xmodal.open('html', function(err, handle) {
    if( err ) xmodal.error(err);
    
    handle.on('open', function() {
      xmodal.alert('dialog open!');
    }).on('close', function() {
      xmodal.alert('dialog close!');
    });
    
    console.log('handle', handle);
    xmodal.alert('done!');
  });
};

window.opendialogajax = function() {
  xmodal.open({
    src: 'popup.html'
  }, function(err, handle) {
    if( err ) xmodal.error(err);
    
    handle.on('open', function() {
      xmodal.alert('dialog open!');
    }).on('close', function() {
      xmodal.alert('dialog close!');
    });
    
    console.log('handle', handle);
    xmodal.alert('dialog open!');
  });
};