var ajax = require('tinyajax');
var obj2css = require('./obj2css.js');

var z = 201;
var mask = (function() {
  var mask = document.createElement('div');
  mask.setAttribute('class', 'x-modal-mask');
  
  return {
    show: function() {
      if( mask.parentNode !== document.body ) document.body.appendChild(mask);
      mask.style.opacity = 1;
      document.body.style.overflowY = 'hidden';
      
      return this;
    },
    hide: function() {
      mask.style.opacity = null;
      setTimeout(function() {
        if( mask.parentNode ) mask.parentNode.removeChild(mask);
        document.body.style.overflowY = '';
      }, 200);
      return this;
    }
  }
})();

function create(options, done) {
  options = options || {};
  
  var id = options.id || ('' + seq++);
  var cls = Array.isArray(options.cls) ? options.cls.join(' ') : options.cls;
  var css = obj2css(options.style);
  
  // container
  var container = document.createElement('div');
  container.setAttribute('id', 'modal-' + id);
  container.className = 'x-modal-container';
  container.style.zIndex = z++;
  if( options.maskbg ) container.style.background = options.maskbg;
  
  if( options.closable !== false ) {
    container.onmousedown = function(e) {
      if( (e.target || e.srcElement) !== container ) return;
      handle.close();
    };
  }
  
  var div = document.createElement('div');
  if( css ) div.setAttribute('style', css);
  if( cls ) div.className = 'x-modal ' + cls;
  else div.setAttribute('class', 'x-modal');
  
  if( options.width ) div.style.width = typeof options.width === 'number' ? (options.width + 'px') : options.width;
  if( options.height ) div.style.height = typeof options.height === 'number' ? (options.height + 'px') : options.height;
  if( options.margin ) div.style.margin = (+options.margin || 0) + 'px auto';
  if( options.background ) div.style.background = options.background;
  
  if( options.shadow === false ) div.style.boxShadow = 'none';
  else if( options.shadow ) div.style.boxShadow = options.shadow;
  
  var resizelistener;
  if( options.fullsize ) {
    div.style.margin = 0;
    div.style.width = '100%';
    div.style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px';
    
    resizelistener = function() {
      div.style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px';
    };
    
    window.addEventListener('resize', resizelistener);
  }
  
  container.appendChild(div);
  
  var listeners = {};
  var interval;
  var handle = {
    id: id,
    target: div,
    body: div,
    container: container,
    on: function(type, fn) {
      var arr = listeners[type] = listeners[type] || [];
      arr.push(fn);
      return this;
    },
    off: function(type, fn) {
      var arr = listeners[type];
      if( arr ) {
        for(var index;(index = arr.indexOf(item)) >= 0;) {
          arr.splice(index, 1);
        }
      }
      return this;
    },
    fire: function(type, detail) {
      var event = {
        type: type,
        detail: detail
      };
      (listeners[type] || []).forEach(function(listener) {
        listener.call(handle, event);
      });
      return this;
    },
    open: function() {
      document.body.appendChild(container);
      
      setTimeout(function() {
        div.style.opacity = 1;
        div.style.transform = 'scale(1,1)';
        
        var showclosebtn = div.querySelectorAll('*[modal-close], .modal-close').length ? false : true;
        if( 'closebtn' in options ) showclosebtn = options.closebtn;
        
        if( showclosebtn ) {
          var closebtn = document.createElement('div');
          closebtn.className = 'x-modal-close-btn';
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
        
        handle.fire('open');
      }, 10);
    },
    close: function() {
      if( interval ) clearInterval(interval);
      
      div.style.opacity = 0;
      div.style.transform = 'scale(.6,.6)';
      
      if( resizelistener ) window.removeEventListener('resize', resizelistener);
      
      setTimeout(function() {
        try { document.body.removeChild(container); } catch(e) {}
        
        handle.fire('close');
      }, 200);
    },
    contents: function(contents) {
      div.innerHTML = '';
      
      if( contents ) {
        if( contents.nodeType ) div.appendChild(contents);
        if( typeof contents == 'string' ) div.innerHTML = contents;
        else if( typeof contents.length == 'number' ) {
          [].forEach.call(contents, function(node) {
            div.appendChild(node);
          });
        }
      }
      
      return this;
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
}

var seq = 100;
var modals = [];
var ctx = module.exports = {
  open: function(options, done) {
    if( typeof options == 'string' ) options = {html:options};
    if( options instanceof Node ) options = {el:options};
    
    options = options || {};
    
    var prev = options.id ? ctx.get(options.id) : null;
    if( prev ) {
      return load({
        src: options.src,
        html: options.html,
        el: options.el
      }, function(err, html) {
        if( err ) return done(err);
        
        prev.contents(html).open();
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
        fullsize: options.fullsize,
        closebtn: options.closebtn,
        closable: options.closable,
        shadow: options.shadow,
        maskbg: options.maskbg,
        width: options.width,
        height: options.height,
        margin: options.margin
      }, function(err, handle) {
        if( err ) return done(err);
        
        handle.on('open', function() {
          if( ~modals.indexOf(this) ) modals.splice(modals.indexOf(this), 1);
          var current = modals[modals.length - 1];
          modals.push(this);
          
          if( current ) {
            current.body.style.transform = 'scale(.85, .85)';
            current.body.style.opacity = '.9';
          }
          
          mask.show();
        });
        
        handle.on('close', function() {
          if( ~modals.indexOf(this) ) modals.splice(modals.indexOf(this), 1);
          if( !modals.length ) mask.hide();
          else {
            var current = modals[modals.length - 1];
            current.body.style.transform = '';
            current.body.style.opacity = '';
          }
        });
        
        handle.contents(html).open();
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