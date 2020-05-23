export const object2css = (o: { [key: string]: any }) => {
  if (!o || typeof o !== 'object') return '';
  let text = '';
  for (const key in o) {
    if (!key || !o[key]) continue;
    text += key + ': ' + o[key] + ';';
  }
  return text;
};
