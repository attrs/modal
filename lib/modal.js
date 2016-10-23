var ajax = require('./ajax.js');

var z = 10000;

var mask = (function() {
  var mask = document.createElement('div');
  mask.setAttribute('class', 'x-modal-mask');
  mask.style.background = 'rgba(0,0,0,.5)';
  mask.style.position = 'fixed';
  mask.style.top = mask.style.bottom = mask.style.left = mask.style.right = 0;
  mask.style.opacity = 0;
  mask.style.zIndex = z++;
  mask.style.overflow = 'auto';
  mask.style.transition = 'opacity .25s ease-in-out';
  
  return {
    show: function() {
      if( mask.parentNode !== document.body ) document.body.appendChild(mask);
      mask.style.display = 'block';
      mask.style.opacity = 1;
      return this;
    },
    hide: function() {
      mask.style.opacity = 0;
      setTimeout(function() {
        mask.style.display = 'none';
      }, 200);
      return this;
    }
  }
})();

function create(options, done) {
  options = options || {};
  
  var id = options.id || ('' + seq++);
  var cls = Array.isArray(options.cls) ? options.cls.join(' ') : options.cls;
  var css = '';
  if( typeof options.style === 'object' ) {
    for(var k in options.style) {
      css += (k + ': ' + (options.style[k] || '') + ';');
    }
  }
  
  // container
  var container = document.createElement('div');
  container.setAttribute('id', 'modal-' + id);
  container.setAttribute('class', 'x-modal-container');
  container.style.background = 'transparent';
  container.style.position = 'fixed';
  container.style.top = container.style.bottom = container.style.left = container.style.right = 0;
  container.style.zIndex = z++;
  container.style.overflowY = 'scroll';
  container.style.transition = 'opacity .25s ease-in-out';
  container.onclick = function(e) {
    if( (e.target || e.srcElement) !== container ) return;
    handle.close();
  };
  
  var div = document.createElement('div');
  if( css ) div.setAttribute('style', css);
  if( cls ) div.setAttribute('class', 'x-modal ' + cls);
  else div.setAttribute('class', 'x-modal');
  
  div.style.position = 'relative';
  div.style.boxSizing = 'border-box';
  div.style.transition = 'all .15s ease-in';
  div.style.transform = 'scale(.6,.6)';
  div.style.opacity = 0;
  div.style.background = options.background || '#fff';
  div.style.width = typeof options.width === 'number' ? (options.width + 'px') : options.width;
  div.style.height = typeof options.height === 'number' ? (options.height + 'px') : options.height;
  if( options.shadow !== false ) div.style.boxShadow = '0 5px 15px rgba(0,0,0,.5)';
  
  div.style.margin = (+options.margin || 0) + 'px auto';
  div.style.marginTop = (+options.marginTop || 0) + 'px';
  div.style.marginBottom = (+options.marginBottom || 0) + 'px';
  
  if( options.closable !== false ) {
    var closebtns = div.querySelectorAll('*[modal-close], .modal-close');
    var showclosebtn = closebtns.length ? false : true;
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
    
    [].forEach.call(closebtns, function(el) {
      el.onclick = function() {
        handle.close();
      }
    });
  }
  
  container.appendChild(div);
  
  var handle = {
    id: id,
    body: div,
    container: container,
    open: function() {
      handle.onOpen && handle.onOpen(handle);
      
      document.body.appendChild(container);
      
      setTimeout(function() {
        div.style.opacity = 1;
        div.style.transform = 'scale(1,1)';
      }, 10);
    },
    close: function() {
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

var seq = 100;
var modals = [];
var ctx = module.exports = {
  open: function(options, done) {
    if( typeof options == 'string' ) options = {html:options};
    options = options || {};
    
    var prev = options.id ? ctx.get(options.id) : null;
    if( prev ) {
      return done(null, prev);
    }
    
    var load = function(done) {
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
    
    load(function(err, html) {
      if( err ) return done(err);
      
      create({
        id: options.id,
        cls: options.cls,
        style: options.style,
        closebtn: options.closebtn,
        closable: options.closable,
        shadow: options.shadow,
        width: options.width || 700,
        height: options.height,
        background: options.background,
        margin: options.margin,
        marginTop: options.marginTop || 50,
        marginBottom: options.marginBottom
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
        
        if( html ) {
          if( html.nodeType ) handle.body.appendChild(html);
          if( typeof html === 'string' ) handle.body.innerHTML = html;
          else if( html.length ) {
            [].forEach.call(html, function(node) {
              handle.body.appendChild(node);
            });
          }
        }
        
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