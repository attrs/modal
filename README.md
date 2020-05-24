# @attrs/modal

## Installation
```sh
$ npm install @attrs/modal --save
```

## Usage
```javascript
import Modal from '@attrs/modal';

const options = {
  id: 'id',
  cls: 'cls1 cls2',
  style: {
    'color': '#333',
    'border-radius': '8px'
  },
  maskbg: 'rgba(0,0,0,.24)',
  closable: true,
  width: '50%',
  height: 600,
  margin: '35px',
  background: '#fff',
  shadow: '#000 0px 5px 15px',
  fullsize: false,
  closebtn: true,
  contents: 'contents'
};

// class style
let instance = new Modal(options);
instance.contents('new contents');
instance.open();

setTimeout(() => {
  instance.close();
}, 15000);

// static methods
await Modal.open({ contents: 'a' });
await Modal.open({ contents: 'b' });
await Modal.open({ contents: 'c' });
const ids = Modal.ids();
console.log('ids', ids);
console.log('current', Modal.current());
console.log('get', Modal.get(ids[0]));

setTimeout(() => {
  Modal.close(ids[0]);
}, 5000);

setTimeout(() => {
  Modal.closeAll();
}, 15000);
```

