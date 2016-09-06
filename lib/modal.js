var path = require('path');
var $ = require('jquery');
var swal = require('sweetalert');

require('sweetalert/dist/sweetalert.css');
require('magnific-popup');
require('magnific-popup/dist/magnific-popup.css');

module.exports = {
  open: function(options) {
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
    if( typeof options === 'string' ) options = {message:options};
    if( typeof done === 'string' ) options.title = done, done = arguments[2];
    
    swal({
      title: options.title,
      text: options.message || options.text,
      inputPlaceholder: options.inputPlaceholder || options.placeholder,
      type: 'input',
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "네",
      cancelButtonText: "아니요",
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
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "네",
      cancelButtonText: "아니요",
      showCancelButton: true,
      closeOnConfirm: false
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
      var text = (err.stack || err.serverStack || err.message || err || '').split('\n').join('<br>');
      html = '<div style="width:100%;height:150px;overflow:auto;font-size:9px;text-align:left;">' + text + '</div>';
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
  modal: function(options) {
    var html = '<div class="modal fade" tabindex="-1" role="dialog">\
      <div class="modal-dialog" role="document">\
        <div class="modal-content">\
          <div class="modal-header">\
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
            <h4 class="modal-title"></h4>\
          </div>\
          <div class="modal-body p0"></div>\
        </div>\
      </div>\
    </div>';
    
    var el = $(html)
    .on('shown.bs.modal', function(e) {
      options.onshow && options.onshow(e);
    })
    .on('hidden.bs.modal', function(e) {
      el.remove();
      options.onclose && options.onclose(e);
    });
    
    if( options.width ) el.find('.modal-dialog').css('width', (typeof options.width === 'number') ? (options.width + 'px') : options.width);
    if( options.title ) el.find('.modal-title').html(options.title);
    if( options.body ) el.find('.modal-body').append(options.body);
    
    setTimeout(function() {
      el.modal('show');
    }, 250);
    
    return {
      open: function() {
        el.modal('show');
        return this;
      },
      close: function() {
        el.modal('hide');
        return this;
      }
    };
  },
  __modal: function(options, done) {
    if( typeof done !== 'function' ) done = function(err) { if( err ) return console.error(err) };
    if( !options ) return done(new Error('missing options'));
  
    if( typeof options === 'string' ) {
      var src = options;
      var type = 'ajax';
      if( src[0] === '#' ) type = 'inline';
      else if( ~['.jpeg', '.jpg', '.png', '.gif', '.bmp','.webp', '.xbm'].indexOf(path.extname(src).toLowerCase()) ) type = 'image';
    
      options = {
        type: type,
        items: {
          src: src
        },
        overflowY: 'auto',
        callbacks: {
          beforeOpen: function(e) {}
        }
      }
    }
  
    var callbacks = options.callbacks = options.callbacks || {};
    callbacks.open = function(e) {
      done();
    };
  
    $.magnificPopup.open(options);
    
    return this;
  }
};