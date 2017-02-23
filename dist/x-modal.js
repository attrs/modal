(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("XModal", [], factory);
	else if(typeof exports === 'object')
		exports["XModal"] = factory();
	else
		root["XModal"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ajax = __webpack_require__(1);
	__webpack_require__(2);
	
	var z = 200;
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
	      if( mask.parentNode !== document.body ) document.body.appendChild(mask);
	      mask.style.display = 'block';
	      mask.style.opacity = 1;
	      document.body.style.overflowY = 'hidden';
	      
	      return this;
	    },
	    hide: function() {
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
	    container.onmousedown = function(e) {
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
	  div.style.margin = (+options.margin || 0) + 'px auto';
	  if( options.background ) div.style.background = options.background;
	  if( options.shadow !== false ) div.style.boxShadow = (typeof options.shadow == 'string') ? options.shadow : '0 5px 15px rgba(0,0,0,.5)';
	  
	  //console.log('height', window.innerHeight || document.documentElement.clientHeight);
	  
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
	      }, 10);
	    },
	    close: function() {
	      if( interval ) clearInterval(interval);
	      handle.onClose && handle.onClose(handle);
	      
	      div.style.opacity = 0;
	      div.style.transform = 'scale(.6,.6)';
	      
	      if( resizelistener ) window.removeEventListener('resize', resizelistener);
	      
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
	    var shellhtml = __webpack_require__(6);
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
	      return load({
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
	        fullsize: options.fullsize,
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

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./modal.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./modal.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".x-modal-shell {\n  background: #fff;\n}\n", ""]);
	
	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div class=\"x-modal-shell\">\n  <div class=\"x-modal-shell-header\"></div>\n  <div class=\"x-modal-shell-body\"></div>\n  <div class=\"x-modal-shell-footer\"></div>\n</div>";

/***/ }
/******/ ])
});
;
//# sourceMappingURL=x-modal.js.map