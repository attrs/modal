import { object2css } from './object2css';
import { mask } from './mask';

export class ModalOptions {
  public id?: string;
  public cls?: string;
  public style?: any;
  public maskbg?: string;
  public closable?: boolean;
  public width?: string | number;
  public height?: string | number;
  public margin?: string;
  public background?: string;
  public shadow?: string | boolean;
  public fullsize?: boolean;
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
    Modal.modals.find((modal) => modal.id === id)?.close();
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
  public readonly body: HTMLElement;
  private readonly resizelistener: () => void;
  private interval;

  constructor(options?: ModalOptions) {
    this.options = options = options || {};

    const id = (this.id = options.id || '' + Modal.seq++);
    const cls = Array.isArray(options.cls) ? options.cls.join(' ') : options.cls;
    const css = object2css(options.style);

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
    if (css) div.setAttribute('style', css);
    if (cls) div.className = 'x-modal-body ' + cls;
    else div.setAttribute('class', 'x-modal-body');

    if (options.width) div.style.width = typeof options.width === 'number' ? options.width + 'px' : options.width;
    if (options.height) div.style.height = typeof options.height === 'number' ? options.height + 'px' : options.height;
    if (options.margin && typeof options.margin === 'string') div.style.margin = options.margin + 'px auto';
    if (options.margin && typeof options.margin === 'number') div.style.margin = (+options.margin || 0) + 'px auto';
    if (options.background) div.style.background = options.background;

    if (options.shadow === false) div.style.boxShadow = 'none';
    else if (options.shadow) div.style.boxShadow = options.shadow as string;

    let resizelistener;
    if (options.fullsize) {
      div.style.margin = '0';
      div.style.width = '100%';
      div.style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px';

      resizelistener = () => {
        div.style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px';
      };

      window.addEventListener('resize', resizelistener);
    }

    container.appendChild(div);
    if (options.contents) this.contents(options.contents);
  }

  public open(): Modal {
    document.body.appendChild(this.container);
    const div = this.body;
    const options = this.options;

    setTimeout(() => {
      div.classList.add('x-modal-active');

      const isclosebtnexist = div.querySelectorAll('*[modal-close], .modal-close').length ? true : false;

      if (!isclosebtnexist && options.closebtn) {
        const closebtn = document.createElement('div');
        closebtn.className = 'x-modal-close-btn';

        const btnstyle = typeof options.closebtn === 'object' ? options.closebtn : null;
        if( btnstyle ) {
          if( typeof btnstyle.top === 'string' ) closebtn.style.top = btnstyle.top;
          if( typeof btnstyle.top === 'number' ) closebtn.style.top = (+btnstyle.top || 0) + 'px';
          if( typeof btnstyle.right === 'string' ) closebtn.style.right = btnstyle.right;
          if( typeof btnstyle.right === 'number' ) closebtn.style.right = (+btnstyle.right || 0) + 'px';
          if( typeof btnstyle.left === 'string' ) closebtn.style.left = btnstyle.left;
          if( typeof btnstyle.left === 'number' ) closebtn.style.left = (+btnstyle.left || 0) + 'px';
          if( typeof btnstyle.bottom === 'string' ) closebtn.style.bottom = btnstyle.bottom;
          if( typeof btnstyle.bottom === 'number' ) closebtn.style.bottom = (+btnstyle.bottom || 0) + 'px';
          if( typeof btnstyle.width === 'string' ) closebtn.style.width = btnstyle.width;
          if( typeof btnstyle.width === 'number' ) closebtn.style.width = (+btnstyle.width || 0) + 'px';
          if( typeof btnstyle.height === 'string' ) closebtn.style.height = btnstyle.height;
          if( typeof btnstyle.height === 'number' ) closebtn.style.height = (+btnstyle.height || 0) + 'px';
          if( typeof btnstyle.opacity === 'string' ) closebtn.style.opacity = btnstyle.opacity;
          if( typeof btnstyle.opacity === 'number' ) closebtn.style.opacity = btnstyle.opacity + '';
        }

        div.appendChild(closebtn);
        closebtn.onclick = () => this.close();
      }

      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.container.querySelectorAll('*[modal-close], .modal-close').forEach((el) => el.addEventListener('click', () => this.close()));
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
    }, 250);
  }
}
