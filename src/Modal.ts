import { object2css } from './object2css';
import { mask } from './mask';

document.addEventListener('keydown', (e) => {
  if( e.keyCode === 27 ) {
    const modal = Modal.current();
    if( modal ) modal.close();
  }
});

export class ModalOptions {
  public id?: string;
  public cls?: string;
  public style?: any;
  public maskbg?: string;
  public closable?: boolean;
  public background?: string;
  public borderRadius?: string | number;
  public width?: string | number;
  public minWidth?: string | number;
  public maxWidth?: string | number;
  public height?: string | number;
  public minHeight?: string | number;
  public maxHeight?: string | number;
  public top?: string | number;
  public left?: string | number;
  public right?: string | number;
  public bottom?: string | number;
  public center?: boolean;
  public shadow?: string | boolean;
  public fullscreen?: boolean;
  public closebtn?: boolean;
  public contents?: string | HTMLElement | string[] | HTMLElement[];
}

export class Modal {
  public static INITIAL_SEQ = 1;
  public static INITIAL_ZINDEX = 200;

  public static async open(options?: ModalOptions): Promise<Modal> {
    if (typeof options === 'string') options = { id: options };

    const prev = options.id ? this.get(options.id) : null;
    if (prev) {
      prev.open();
      return prev;
    }

    return new Modal(options).open();
  }

  public static current() {
    return Modal.modals[Modal.modals.length - 1];
  }

  public static ids() {
    return Modal.modals.map((modal) => modal.id);
  }

  public static get(id: string) {
    return Modal.modals.find((modal) => modal.id === id);
  }

  public static close(id: string) {
    if (id) Modal.modals.find((modal) => modal.id === id)?.close();
    else Modal.current()?.close();
    return Modal;
  }

  public static closeAll() {
    Modal.modals.forEach((modal) => modal.close());
    return Modal;
  }

  private static seq = 1;
  private static z = 200;
  private static modals: Modal[] = [];

  public readonly id: string;
  public readonly options: ModalOptions;
  public readonly container: HTMLElement;
  public body: HTMLElement;
  private readonly resizelistener: () => void;
  private interval;

  constructor(options?: ModalOptions) {
    this.options = options = options || {};

    const id = (this.id = options.id || '' + Modal.seq++);

    // container
    const container = (this.container = document.createElement('div'));
    container.setAttribute('id', 'modal-' + id);
    container.className = 'x-modal-container';
    container.style.zIndex = Modal.z++ + '';
    if (options.maskbg) container.style.background = options.maskbg;

    if (options.closable !== false) {
      container.onmousedown = (e) => {
        if ((e.target || e.srcElement) !== container) return;
        this.close();
      };
    }

    const div = (this.body = document.createElement('div'));
    const cls = Array.isArray(options.cls) ? options.cls.join(' ') : options.cls;
    const css = object2css(options.style);
    if (css) div.setAttribute('style', css);
    if (cls) div.className = 'x-modal-body ' + cls;
    else div.setAttribute('class', 'x-modal-body');

    if (options.background) div.style.background = options.background;

    if (!options.fullscreen) {
      if (options.width) div.style.width = typeof options.width === 'number' ? options.width + 'px' : options.width;
      else {
        if (options.minWidth) div.style.minWidth = typeof options.minWidth === 'number' ? options.minWidth + 'px' : options.minWidth;
        if (options.maxWidth) div.style.maxWidth = typeof options.maxWidth === 'number' ? options.maxWidth + 'px' : options.maxWidth;
      }
      if (options.height) div.style.height = typeof options.height === 'number' ? options.height + 'px' : options.height;
      else {
        if (options.minHeight) div.style.minHeight = typeof options.minHeight === 'number' ? options.minHeight + 'px' : options.minHeight;
        if (options.maxHeight) div.style.maxHeight = typeof options.maxHeight === 'number' ? options.maxHeight + 'px' : options.maxHeight;
      }
      if (options.borderRadius) div.style.borderRadius = typeof options.borderRadius === 'number' ? options.borderRadius + 'px' : options.borderRadius;

      if (!options.center) {
        if (options.top) div.style.marginTop = typeof options.top === 'number' ? options.top + 'px' : options.top;
        if (options.left) div.style.marginLeft = typeof options.left === 'number' ? options.left + 'px' : options.left;
        if (options.right) div.style.marginRight = typeof options.right === 'number' ? options.right + 'px' : options.right;
        if (options.bottom) div.style.marginBottom = typeof options.bottom === 'number' ? options.bottom + 'px' : options.bottom;
      }

      if (options.shadow === false) div.style.boxShadow = 'none';
      else if (typeof options.shadow === 'string') div.style.boxShadow = options.shadow;
    }

    let resizelistener;
    if (options.fullscreen) {
      div.style.margin = '0';
      div.style.maxWidth = '100%';
      div.style.width = '100%';
      div.style.boxShadow = 'none';
      div.style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px';

      resizelistener = () => {
        div.style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px';
      };

      window.addEventListener('resize', resizelistener);
    }

    container.appendChild(div);
    document.body.appendChild(this.container);
    if (options.contents) this.contents(options.contents);
  }

  public open(): Modal {
    const options = this.options;
    const container = this.container;
    const div = this.body;

    setTimeout(() => {
      div.classList.add('x-modal-active');

      // const isclosebtnexist = div.querySelectorAll('*[modal-close], .modal-close').length ? true : false;
      // if (!isclosebtnexist && options.closebtn) {
      if (options.closebtn) {
        const closebtn = document.createElement('div');
        closebtn.className = 'x-modal-close-btn';

        const btnstyle = typeof options.closebtn === 'object' ? options.closebtn : null;
        if (btnstyle) {
          if (typeof btnstyle.top === 'string') closebtn.style.top = btnstyle.top;
          if (typeof btnstyle.top === 'number') closebtn.style.top = (+btnstyle.top || 0) + 'px';
          if (typeof btnstyle.right === 'string') closebtn.style.right = btnstyle.right;
          if (typeof btnstyle.right === 'number') closebtn.style.right = (+btnstyle.right || 0) + 'px';
          if (typeof btnstyle.left === 'string') closebtn.style.left = btnstyle.left;
          if (typeof btnstyle.left === 'number') closebtn.style.left = (+btnstyle.left || 0) + 'px';
          if (typeof btnstyle.bottom === 'string') closebtn.style.bottom = btnstyle.bottom;
          if (typeof btnstyle.bottom === 'number') closebtn.style.bottom = (+btnstyle.bottom || 0) + 'px';
          if (typeof btnstyle.width === 'string') closebtn.style.width = btnstyle.width;
          if (typeof btnstyle.width === 'number') closebtn.style.width = (+btnstyle.width || 0) + 'px';
          if (typeof btnstyle.height === 'string') closebtn.style.height = btnstyle.height;
          if (typeof btnstyle.height === 'number') closebtn.style.height = (+btnstyle.height || 0) + 'px';
          if (typeof btnstyle.opacity === 'string') closebtn.style.opacity = btnstyle.opacity;
          if (typeof btnstyle.opacity === 'number') closebtn.style.opacity = btnstyle.opacity + '';
          if (typeof btnstyle.color) closebtn.style.color = btnstyle.color;
        }

        div.appendChild(closebtn);
        closebtn.addEventListener('mousedown', (e) => {
          if ((e.target || e.srcElement) !== closebtn) return;
          this.close();
        });
      }

      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.container.querySelectorAll('*[modal-close], .modal-close').forEach((el) => {
          if (el.classList.contains('x-modal-close-bind')) return;
          el.classList.add('x-modal-close-bind');
          el.addEventListener('mousedown', (e) => {
            if ((e.target || e.srcElement) !== el) return;
            this.close();
          });
        });
      }, 250);
    }, 1);

    if (~Modal.modals.indexOf(this)) Modal.modals.splice(Modal.modals.indexOf(this), 1);
    const current = Modal.modals[Modal.modals.length - 1];
    Modal.modals.push(this);

    current && current.body.classList.remove('x-modal-active');
    mask.show();

    return this;
  }

  public contents(contents) {
    const div = this.body;
    div.innerHTML = '';

    if (contents) {
      if (contents instanceof HTMLElement) div.appendChild(contents);
      if (typeof contents === 'string') div.innerHTML = contents;
      else if (Array.isArray(contents)) {
        contents.forEach((node) => {
          div.appendChild(node);
        });
      }
    }

    return this;
  }

  public close() {
    if (this.interval) clearInterval(this.interval);

    const div = this.body;
    div.classList.remove('x-modal-active');
    div.classList.add('x-modal-willclose');

    if (this.resizelistener) window.removeEventListener('resize', this.resizelistener);

    setTimeout(() => {
      if (~Modal.modals.indexOf(this)) Modal.modals.splice(Modal.modals.indexOf(this), 1);
      if (!Modal.modals.length) {
        Modal.z = Modal.INITIAL_ZINDEX;
        Modal.seq = Modal.INITIAL_SEQ;
        mask.hide();
      } else {
        const current = Modal.modals[Modal.modals.length - 1];
        current && current.open();
      }
      document.body.removeChild(this.container);
    }, 1);
  }
}
