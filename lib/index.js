var swal = require('sweetalert');
var modal = require('./modal.js');

require('sweetalert/dist/sweetalert.css');

module.exports = {
  popup: function(options) {
    if( !options ) return console.error('missing options');
    if( !options.url ) return console.error('missing url');
    
    var width = options.width;
    var height = options.height;
    if( width > window.screen.width ) width = window.screen.width;
    if( height > window.screen.height ) height = window.screen.height;
    
    var top = options.top || height ? (window.screen.height / 2) - (height / 2) : 0;
    var left = options.left || width ? (window.screen.width / 2) - (width / 2) : 0;
    if( !top || top < 0 ) top = 0;
    if( !left || left < 0 ) left = 0;
    
    var url = options.url;
    var scrollbar = options.scrollbar === false ? 'no' : 'yes';
    var resizable = options.resizable === false ? 'no' : 'yes';
    var channelmode = options.channelmode === false ? 'no' : 'yes';
    var name = options.name || Math.random() + '';
    
    window.open(url, name, 'channelmode=' + channelmode + ',resizable=' + resizable + ',scrollbars=' + scrollbar + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
    
    return this;
  },
  required: function(msg, el) {
    alert(msg);
    if( typeof el === 'string' ) el = $(el);
    if( el && el.focus ) el.focus();
    
    return this;
  },
  alert: function(options, done) {
    if( typeof options === 'string' ) options = {message:options};
    if( typeof done === 'string' ) options.title = done, done = arguments[2];
    
    swal({
      title: options.title || '알림',
      text: options.message || options.text,
      type: options.type,
      animation: options.animation,
      timer: options.timer,
      showConfirmButton: options.showConfirmButton || options.timer ? false : true,
      imageUrl: options.imageUrl,
      html: true
    }, function() {
      if( typeof done === 'function' ) done.apply(this, arguments);
    });
    
    return this;
  },
  prompt: function(options, done) {
    if( typeof options === 'string' ) options = {title:options};
    if( typeof done === 'string' ) options.message = done, done = arguments[2];
    
    swal({
      title: options.title,
      text: options.message || options.text,
      inputPlaceholder: options.inputPlaceholder || options.placeholder,
      type: 'input',
      confirmButtonColor: options.yescolor || "#DD6B55",
      confirmButtonText: options.yes || "네",
      cancelButtonText: options.no || "아니요",
      showCancelButton: true,
      closeOnConfirm: false
    }, function() {
      if( typeof done === 'function' ) done.apply(this, arguments);
    });
    
    return this;
  },
  confirm: function(options, done) {
    if( typeof options === 'string' ) options = {title:options};
    if( typeof done === 'string' ) options.message = done, done = arguments[2];
    
    swal({
      title: options.title,
      text: options.message || options.text,
      type: options.type,
      confirmButtonColor: options.yescolor || "#DD6B55",
      confirmButtonText: options.yes || "네",
      cancelButtonText: options.no || "아니요",
      showCancelButton: true,
      closeOnConfirm: options.closeOnConfirm || false
    }, function() {
      if( typeof done === 'function' ) done.apply(this, arguments);
    });
    
    return this;
  },
  error: function(title, err, done) {
    if( arguments.length <= 2 ) done = err;
    if( title instanceof Error ) err = title, title = null;
    
    var html;
    if( err ) {
      var text = (err.message || err || '').split('\n').join('<br>');
      html = '<div style="color:#474747;width:100%;height:150px;overflow:auto;font-size:12px;text-align:left;">' + text + '</div>';
    }
    
    swal({
      title: title || '오류',
      text: html,
      html: true,
      type: 'error'
    }, function() {
      if( typeof done === 'function' ) done.apply(this, arguments);
    });
    
    return this;
  },
  warning: function(title, err, done) {
    if( arguments.length <= 2 ) done = err;
    if( title instanceof Error ) err = title, title = null;
    
    var html;
    if( err ) {
      var text = (err.stack || err.serverStack || err.message || err || '').split('\n').join('<br>');
      html = '<div style="width:100%;height:150px;overflow:auto;font-size:9px;text-align:left;">' + text + '</div>';
    }
    
    swal({
      title: title || '경고',
      text: html,
      html: true,
      type: 'warning'
    }, function() {
      if( typeof done === 'function' ) done.apply(this, arguments);
    });
    
    return this;
  },
  success: function(msg, done) {
    swal({
      title: '성공',
      text: msg,
      type: 'success'
    }, function() {
      if( typeof done === 'function' ) done.apply(this, arguments);
    });
    
    return this;
  },
  open: function(options, done) {
    modal.open.apply(modal, arguments);
    return this;
  },
  current: function() {
    return modal.current.apply(modal, arguments);
  },
  ids: function() {
    return modal.ids.apply(modal, arguments);
  },
  get: function(id) {
    return modal.get.apply(modal, arguments);
  },
  close: function(id) {
    modal.close.apply(modal, arguments);
    return this;
  },
  closeAll: function() {
    modal.closeAll.apply(modal, arguments);
    return this;
  }
};