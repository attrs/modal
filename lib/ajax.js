module.exports = function(src, done) {
  var xhr = win.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('GET', src);
  xhr.onreadystatechange = function(e) {
    if( this.readyState == 4 ) {
      var status = this.status, restext = this.responseText;
      if( status === 0 || (status >= 200 && status < 300) ) done(null, restext);
      else done(new Error('[' + status + '] ' + restext));
    }
  };
  xhr.send();
};