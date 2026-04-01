const template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        :host 
        { 
            display: block; 
            cursor: grab; 
            user-select: none;
            width: 100%;  
            min-width: 0;
            box-sizing: border-box;
        }
        :host(.dragging) 
        { 
            opacity: 0.5; 
            border: 2px dashed #ccc; 
        }
    </style>
    <slot></slot>
`;

class DraggableItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.setAttribute('draggable', 'true');
    
    this.addEventListener('dragstart', (e) => {
      this.classList.add('dragging');

      //pass the id of the dragged item
      e.dataTransfer.setData('text/plain', this.id); 
    });

    this.addEventListener('dragend', () => {
      this.classList.remove('dragging');
    });
  }
}
customElements.define('draggable-item', DraggableItem);