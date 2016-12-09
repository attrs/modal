var ajax = require('./ajax.js');
require('./style/modal.less');

var z = 10000;
var mask = (function() {
  var mask = document.createElement('div');
  mask.setAttribute('class', 'x-modal-mask');
  mask.style.position = 'fixed';
  mask.style.top = mask.style.bottom = mask.style.left = mask.style.right = 0;
  mask.style.opacity = 0;
  mask.style.zIndex = z++;
  mask.style.overflow = 'hidden';
  
  return {
    show: function() {
      console.log('mask.show');
      if( mask.parentNode !== document.body ) document.body.appendChild(mask);
      mask.style.display = 'block';
      mask.style.opacity = 1;
      document.body.style.overflowY = 'hidden';
      
      return this;
    },
    hide: function() {
      console.log('mask.hide');
      mask.style.opacity = 0;
      setTimeout(function() {
        if( mask.parentNode ) mask.parentNode.removeChild(mask);
        document.body.style.overflowY = '';
      }, 200);
      return this;
    }
  }
})();

function object2css(o) {
  if( !o || typeof o !== 'object' ) return '';
  var text = '';
  for(var k in o) {
    if( !k || !o[k] ) return;
    text += k + ': ' + o[k] + ';';
  }
  return text;
}


function create(options, done) {
  options = options || {};
  
  var id = options.id || ('' + seq++);
  var cls = Array.isArray(options.cls) ? options.cls.join(' ') : options.cls;
  var css = object2css(options.style);
  
  // container
  var container = document.createElement('div');
  container.setAttribute('id', 'modal-' + id);
  container.className = 'x-modal-container';
  container.style.position = 'fixed';
  container.style.top = container.style.left = container.style.right = container.style.bottom = 0;
  container.style.zIndex = z++;
  container.style.overflowY = 'auto';
  container.style.transition = 'all .25s ease-in-out';
  if( options.maskbg !== false ) container.style.background = (typeof options.maskbg == 'string') ? options.maskbg : 'rgba(0,0,0,.5)';
  
  if( options.closable !== false ) {
    container.onclick = function(e) {
      if( (e.target || e.srcElement) !== container ) return;
      handle.close();
    };
  }
  
  var div = document.createElement('div');
  if( css ) div.setAttribute('style', css);
  if( cls ) div.className = 'x-modal ' + cls;
  else div.setAttribute('class', 'x-modal');
  
  div.style.position = 'relative';
  div.style.boxSizing = 'border-box';
  div.style.transition = 'all .15s ease-in-out';
  div.style.transform = 'scale(.6,.6)';
  div.style.opacity = 0;
  div.style.width = typeof options.width === 'number' ? (options.width + 'px') : options.width;
  div.style.height = typeof options.height === 'number' ? (options.height + 'px') : options.height;
  if( options.background ) div.style.background = options.background;
  if( options.shadow !== false ) div.style.boxShadow = (typeof options.shadow == 'string') ? options.shadow : '0 5px 15px rgba(0,0,0,.5)';
  
  div.style.margin = (+options.margin || 0) + 'px auto';
  
  container.appendChild(div);
  
  
  var interval;
  
  var handle = {
    id: id,
    target: div,
    body: div,
    container: container,
    open: function() {
      handle.onOpen && handle.onOpen(handle);
      
      document.body.appendChild(container);
      
      setTimeout(function() {
        div.style.opacity = 1;
        div.style.transform = 'scale(1,1)';
        
        if( options.closable !== false ) {
          var showclosebtn = div.querySelectorAll('*[modal-close], .modal-close').length ? false : true;
          if( 'closebtn' in options ) showclosebtn = options.closebtn;
          
          if( showclosebtn ) {
            var closebtn = document.createElement('div');
            closebtn.style.position = 'absolute';
            closebtn.style.right = '20px';
            closebtn.style.top = '20px';
            closebtn.style.cursor = 'pointer';
            closebtn.style.opacity = '0.5';
            closebtn.style.zIndex = 10001;
            closebtn.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAaRJREFUSA3tlltSwzAMRcsbVgBsC9gqfPBqYGNwzySn48kkrfP4a++MYsuSriJbcbvZnHDsO3CZDTifsQnEELsYFxMYpviO0r7E8tBZayrQhxhiJ8Hg50T9RX4irjkOEWpjJIZYOIC2Vht5eqb3sW8jEHxGbiJgiMS129jxJYZYOICcrbbn6Tkxvkcgooqh5GXS386XmJIjaj0kJFkTIflHxHWIJb/KvKx06AXjUg+TQERSt/CuoGDOtmKj0usIMLbVZjwlYPyOkIBtP+vERsJW+kZdDglpniZC8rdOmDcRbEDfVlvh6XlS6WuEhAhzoY/66Fjd5j0Gkgu3XH3V0e2jkTxTKrXyJnMbTt8sLYNEjNsI28sIqLaJuFb6Znk+JCpvpK/Q2UgwM7fb+eRW+4YhLm8kX6a8QFjzO+cofDF9s1QHu5PAQzeS5OUNR4zrch3MbKc/xrOsdN+NZJLyhqNyOICcrTbylMSfRRrJt9Y2FKqNsYnQcJN+FuO/w1Nm/rRJvDMOTPThjwCxi2HFNURTfEf5qKDqfHoMxFh9z3RSj2UH/gFDp0r+/I0dzwAAAABJRU5ErkJggg==" title="close">';
            div.appendChild(closebtn);
            
            closebtn.onclick = function() {
              handle.close();
            };
          }
          
          if( interval ) clearInterval(interval);
          interval = setInterval(function() {
            [].forEach.call(container.querySelectorAll('*[modal-close], .modal-close'), function(el) {
              el.onclick = function() {
                handle.close();
              };
            });
          }, 250);
        }
      }, 10);
    },
    close: function() {
      if( interval ) clearInterval(interval);
      handle.onClose && handle.onClose(handle);
      
      div.style.opacity = 0;
      div.style.transform = 'scale(.6,.6)';
      
      setTimeout(function() {
        try { document.body.removeChild(container); } catch(e) {}
      }, 200);
    }
  };
    
  done(null, handle);
}


function load(options, done) {
  var src = options.src;
  var html = options.html;
  var el = options.el;
  
  if( typeof el == 'string' ) {
    el = document.querySelector(el);
    if( !el ) return done(new Error('not found element: ' + options.el));
  }
  
  if( html ) return done(null, html);
  if( el ) return done(null, el);
  if( src ) return ajax(src, done);
  done();
};

function build(handle, options, html) {
  var shell = options.shell, title = options.title, icon = options.icon, btns = options.btns;
  if( shell !== false && (title || icon || btns) ) shell = true;
  if( shell ) {
    var cls = shell.cls, style = shell.style;
    var shellhtml = require('./html/shell.html');
    handle.target.innerHTML = shellhtml;
    handle.target = handle.body.querySelector('.x-modal-shell-body');
    handle.shell = {
      shell: handle.body.querySelector('.x-modal-shell'),
      header: handle.body.querySelector('.x-modal-shell-header'),
      body: handle.body.querySelector('.x-modal-shell-body'),
      footer: handle.body.querySelector('.x-modal-shell-footer')
    };
    
    if( !title && !icon ) handle.shell.header.display = 'none';
    if( !btns || !btns.length ) handle.shell.footer.display = 'none';
    
    if( icon ) {
      handle.shell.header.appendChild(function() {
        var el = document.createElement('span');
        el.className = 'x-modal-shell-icon';
        el.innerHTML = icon;
        return el;
      }());
    }
    
    if( title ) {
      handle.shell.header.appendChild(function() {
        var el = document.createElement('h3');
        el.className = 'x-modal-shell-title';
        el.innerHTML = title;
        return el;
      }());
    }
    
    (btns || []).forEach(function(btn) {
      handle.shell.footer.appendChild(function() {
        var el = document.createElement('a');
        el.className = 'x-modal-shell-btn';
        el.innerHTML = btn.icon + ' ' + btn.text;
        return el;
      }());
    });
  }
  
  if( html ) {
    handle.target.innerHTML = '';
    if( html.nodeType ) handle.target.appendChild(html);
    if( typeof html === 'string' ) handle.target.innerHTML = html;
    else if( typeof html.length == 'number' ) {
      [].forEach.call(html, function(node) {
        handle.target.appendChild(node);
      });
    }
  }
}


var seq = 100;
var modals = [];
var ctx = module.exports = {
  open: function(options, done) {
    if( typeof options == 'string' ) options = {html:options};
    options = options || {};
    
    var prev = options.id ? ctx.get(options.id) : null;
    if( prev ) {
      load({
        src: options.src,
        html: options.html,
        el: options.el
      }, function(err, html) {
        if( err ) return done(err);
        
        build(prev, options, html);
        prev.open();
        done(null, prev);
      });
    }
    
    load({
      src: options.src,
      html: options.html,
      el: options.el
    }, function(err, html) {
      if( err ) return done(err);
      
      create({
        id: options.id,
        cls: options.cls,
        style: options.style,
        background: options.background,
        closebtn: options.closebtn,
        closable: options.closable,
        shadow: options.shadow,
        maskbg: options.maskbg,
        width: options.width || 700,
        height: options.height,
        margin: options.margin || 50
      }, function(err, handle) {
        if( err ) return done(err);
        
        handle.onOpen = function(handle) {
          if( ~modals.indexOf(handle) ) modals.splice(modals.indexOf(handle), 1);
          var current = modals[modals.length - 1];
          modals.push(handle);
          
          if( current ) {
            current.body.style.transform = 'scale(.85, .85)';
            current.body.style.opacity = '.9';
          }
          
          mask.show();
        };
        
        handle.onClose = function(handle) {
          if( ~modals.indexOf(handle) ) modals.splice(modals.indexOf(handle), 1);
          if( !modals.length ) mask.hide();
          else {
            var current = modals[modals.length - 1];
            current.body.style.transform = 'scale(1, 1)';
            current.body.style.opacity = '1';
          }
        };
        
        build(handle, options, html);
        handle.open();
        done(null, handle);
      });
    });
    return this;
  },
  current: function() {
    return modals[modals.length - 1];
  },
  ids: function() {
    var ids = [];
    modals.forEach(function(modal) {
      ids.push(modal.id);
    });
    return ids;
  },
  get: function(id) {
    if( !arguments.length ) return ctx.current();
    
    var result;
    modals.forEach(function(modal) {
      if( modal.id === id ) result = modal;
    });
    return result;
  },
  close: function(id) {
    if( !arguments.length ) ctx.closeAll();
    
    modals.forEach(function(modal) {
      if( modal.id === id ) modal.close();
    });
    
    return this;
  },
  closeAll: function() {
    modals.forEach(function(modal) {
      modal.close();
    });
    return this;
  }
};