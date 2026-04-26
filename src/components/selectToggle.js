const template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle {
          display: flex;
          align-items: center;
          justify-content: center;

          background-color: #4A4A4A;
          width: 100%;
          height: 100%;
          min-width: 60px;
          border-radius: 10px;
          
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease;

          user-select: none;
        }

        .toggle input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle:has(input:checked) {
          background-color: var(--accent);
        }
    </style>

    <label class="toggle">
        <input type="checkbox">
        <slot></slot>
    </label>
`;


class SelectToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (this.hasAttribute('is-selected')) {
      this.selected = true;
    }
  }

   static get observedAttributes() {
    return ['is-selected'];
  }

  connectedCallback() {
  }

  get selected() {
    return this.shadowRoot.querySelector('input').checked;
  }
  set selected(value) {
    this.shadowRoot.querySelector('input').checked = value;
  }
}

customElements.define('select-toggle', SelectToggle);