const template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
    </style>
    <slot></slot>
`;


class ToggleGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

   static get observedAttributes() {
    return ['limit-select'];
  }

  connectedCallback() {
    const toggles = [...this.querySelectorAll('select-toggle')];

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
        const limitSelect = parseInt(this.getAttribute('limit-select')) || 0;

        if (limitSelect > 0) {
          if (this.selectedToggles.length > limitSelect){
            const toggleToDeselect = this.selectedToggles.filter(toggle => toggle !== event.currentTarget)[0];
            if (toggleToDeselect)
                toggleToDeselect.selected = false;
          }
        }
      });
    });
  }

  get selectedToggles() {
    const toggles = [...this.querySelectorAll('select-toggle')];
    return toggles.filter(toggle => toggle.selected);
  }
}

customElements.define('toggle-group', ToggleGroup);