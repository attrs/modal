module.exports = function (o) {
  if( !o || typeof o !== 'object' ) return '';
  var text = '';
  for(var k in o) {
    if( !k || !o[k] ) return;
    text += k + ': ' + o[k] + ';';
  }
  return text;
};