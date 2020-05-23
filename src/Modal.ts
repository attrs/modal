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

  private readonly id: string;
  private readonly options: ModalOptions;
  private readonly container: HTMLElement;
  private readonly body: HTMLElement;
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
    if (options.margin) div.style.margin = (+options.margin || 0) + 'px auto';
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

      let showclosebtn = div.querySelectorAll('*[modal-close], .modal-close').length ? false : true;
      if ('closebtn' in this.options) showclosebtn = options.closebtn;

      if (showclosebtn) {
        const closebtn = document.createElement('div');
        closebtn.className = 'x-modal-close-btn';
        div.appendChild(closebtn);
        closebtn.onclick = () => this.close();
      }

      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.container.querySelectorAll('*[modal-close], .modal-close').forEach((el) => el.addEventListener('click', () => this.close()));
      }, 250);

      if (~Modal.modals.indexOf(this)) Modal.modals.splice(Modal.modals.indexOf(this), 1);
      const current = Modal.modals[Modal.modals.length - 1];
      Modal.modals.push(this);

      current && current.body.classList.remove('x-modal-active');
      mask.show();
    }, 10);

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
    }, 10);
  }
}
