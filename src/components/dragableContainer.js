const template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        :host {
            display: block;
            border: 2px groove white;
            padding: 10px;
            width: 100%;  
            min-width: 0;
            box-sizing: border-box;
        }
    </style>
    <slot></slot>
`;


class DragableContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.onChildReorder = null;
  }

  static get observedAttributes() {
    return ['lock-child'];
  }

  connectedCallback() {
    this.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingItem = document.querySelector('.dragging');

      if (!draggingItem) return;
      if (draggingItem.localName !== 'draggable-item') return;
      
      const isChildLocked = this.hasAttribute('lock-child');
      const isForeigner = draggingItem.parentElement !== this;
      const isDraggedFromLocked = draggingItem.parentElement.hasAttribute('lock-child');

      if (isForeigner && (isChildLocked || isDraggedFromLocked)) return;

      const siblings = [...this.querySelectorAll('draggable-item:not(.dragging)')];

      const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        return e.clientY <= box.top + box.height / 2;
      });

      if (draggingItem.nextSibling !== nextSibling) {
        this.insertBefore(draggingItem, nextSibling);
        
        if (this.onChildReorder)
          this.onChildReorder();
      }
    });
  }
}
customElements.define('dragable-container', DragableContainer);