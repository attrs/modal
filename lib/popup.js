module.exports = function(options) {
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
};