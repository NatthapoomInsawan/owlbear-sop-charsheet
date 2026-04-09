const template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        :host {
          display: block;
          background: rgba(255, 0, 0, 0.05); 
          border: 2px dashed #ff4444;
          padding: 15px;
          width: 100%;  
          min-width: 0;
          box-sizing: border-box;
            
          opacity: 0;
          pointer-events: none;
            
          position: sticky;
          bottom: 5px; 
          border-radius: 5px;
            
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(20px);
          z-index: 1000;
        }

        :host([style*="opacity: 1"]) {
          opacity: 1 !important;
          pointer-events: all;
          transform: translateY(0);
        }

        :host label {
          color: #ff4444;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          text-align: center;
          pointer-events: none;
        }

        :host(.drag-over) {
            background-color: #ff4444;
            border-style: solid;
            box-shadow: 0 0 20px rgba(255, 68, 68, 0.4);
        }

        :host(.drag-over) label {
            color: white;
        }
    </style>
    <label>DROP HERE TO REMOVE</label>
    <slot>
    </slot>
`;


class DragableRemover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener('dragstart', (e) => {
      const draggingItem = document.querySelector('.dragging');

      if (!this.isDragable(draggingItem)) return;

      this.style.opacity = 1;
      this.style.transform = "translateY(0)";
    });

    window.addEventListener('dragend', (e) => {
      this.style.opacity = 0;
      this.style.transform = "translateY(20px)";
    });

    this.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.classList.add('drag-over');
    });

    this.addEventListener('dragleave', (e) => {
      this.classList.remove('drag-over');
    });

    this.addEventListener('drop', (e) => {
      e.preventDefault();
      this.classList.remove('drag-over');
      this.style.opacity = 0;

      const draggingItem = document.querySelector('.dragging');

      if (!this.isDragable(draggingItem)) return;
      
      const container = draggingItem.parentElement;

      draggingItem.remove();
      
      if (container && typeof container.onChildReorder === 'function') {
        container.onChildReorder();
      }
    });
  }

  isDragable(draggingItem){
    

    if (!draggingItem) return false;
    if (draggingItem.localName !== 'draggable-item') return false;
    return true;
  }

}
customElements.define('dragable-remover', DragableRemover);