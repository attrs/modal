export const mask = (() => {
  const maskelement = document.createElement('div');
  maskelement.setAttribute('class', 'x-modal-mask');

  return {
    show() {
      if (maskelement.parentNode !== document.body) document.body.appendChild(maskelement);
      maskelement.style.opacity = '1';
      document.body.style.overflowY = 'hidden';
      return this;
    },
    hide() {
      maskelement.style.opacity = null;
      setTimeout(() => {
        if (maskelement.parentNode) maskelement.parentNode.removeChild(maskelement);
        document.body.style.overflowY = '';
      }, 200);
      return this;
    }
  };
})();
