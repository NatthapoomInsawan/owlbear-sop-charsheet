import { rollD6Pool } from "../dice/diceController.js";

import './selectToggle.js';
import './toggleGroup.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        :host { 
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 9999; 
        }

        #roll-canvas-button { 
            width: 60px; 
            height: 60px; 
            border-radius: 50%; 
            border: none; 
            background-color: rgba(51, 51, 51, 0.85);
            backdrop-filter: blur(5px); 
            color: white; 
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); 
            font-size: 24px;
            position: relative;
            z-index: 2;
        }

        #roll-canvas-button:hover {
            background-color: var(--accent);
        }

        .dice-canvas-container {
            display: none;
            position: absolute;
            bottom: 80px; 
            right: 0;
            width: auto;
            padding: 15px;
            flex-direction: column;
            gap: 10px;
            
            background-color: rgba(51, 51, 51, 0.85);
            backdrop-filter: blur(5px); 
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            
            z-index: 1;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .dice-canvas-container.visible { 
            display: flex; 
            opacity: 1; 
        }

        .dice-canvas-container input {
            font-size: 18px;
            padding: 5px;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
        }

        .dice-canvas-container button {
            cursor: pointer;
        }

        .toggle-group {
            display: flex;
            justify-content: space-between;
            gap: 5px;
        }

    </style>
    <div class="dice-canvas-container">
        <label>DICE COUNT</label>
        <input type = "number" min = "1" value = "1">
        <toggle-group class ="toggle-group" limit-select = "1">
            <select-toggle name = "white" is-selected = "true">WHITE</select-toggle>
            <select-toggle name = "red">RED</select-toggle>
            <select-toggle name = "black">BLACK</select-toggle>
        </toggle-group>
        <button>ROLL!</button>
        
    </div>
    <button id="roll-canvas-button">🎲</button>
`;


class DiceRoller extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const canvasButton = this.shadowRoot.querySelector('#roll-canvas-button');
    const container = this.shadowRoot.querySelector('.dice-canvas-container');
    const rollBtn = this.shadowRoot.querySelector('.dice-canvas-container button');
    const diceCountInput = this.shadowRoot.querySelector('.dice-canvas-container input');

    canvasButton.addEventListener('click', () => {
        container.classList.toggle('visible');
    });

    rollBtn.addEventListener('click', () => {
        const count = parseInt(diceCountInput.value);
        const selectedColor = this.shadowRoot.querySelector('toggle-group')?.selectedToggles[0]?.getAttribute('name') || 'white';

        rollD6Pool(count, selectedColor);
        container.classList.remove('visible');
    });

    diceCountInput.addEventListener('blur', () =>{
        let value = parseInt(diceCountInput.value);
        diceCountInput.value = (value > 0) ? value : 1;
    });
  }

  openRollPanel(diceCount) {
    const container = this.shadowRoot.querySelector('.dice-canvas-container');
    const diceCountInput = this.shadowRoot.querySelector('.dice-canvas-container input');
    diceCountInput.value = parseInt(diceCount);
    container.classList.add('visible');
  }
}

customElements.define('dice-roller', DiceRoller);