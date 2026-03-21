import AbstractController from "./abstractController";
import CharacterData from "../models/characterData";
import {CHARACTER_CLASS, CHARACTER_SUBCLASS, CHARACTER_LINEAGE} from "../models/sopData";

export default class CharacterController extends AbstractController{
    constructor() {
        super();
    }

    bindEvents() {
        document.addEventListener("input", (event) =>{
            const modelKey = event.target.dataset.character;
            if (modelKey && modelKey in CharacterData) {
                let value = event.target.value;

                if (event.target.type === "number") {
                    value = parseInt(value) || "";
                    value = Math.max(event.target.min, Math.min(event.target.max, value)); // Ensure value is between min and max
                    event.target.value = value;
                }

                CharacterData[modelKey] = event.target.value;
            }
        });

         document.addEventListener("focusout", (event) => {
            const modelKey = event.target.dataset.character;
            if (modelKey && modelKey in CharacterData) {
                let value = event.target.value;
                
                if (event.target.hasAttribute("calc-field")) {
                    value = this.calculateMathExpression(value);
                    event.target.value = value; // Update the input with the calculated value
                }

                CharacterData[modelKey] = value;
            }
        });
    }

    initData(){
        this.syncCharacterInput(CharacterData);

        this.populateDataList("character-class", CHARACTER_CLASS);
        this.populateDataList("character-subclass", CHARACTER_SUBCLASS);
        this.populateDataList("character-lineage", CHARACTER_LINEAGE);
    }

    syncCharacterInput(dataObject) {
        const inputs = document.querySelectorAll("[data-character]");
        inputs.forEach(input => {
            const modelKey = input.dataset.character;
            if (modelKey in dataObject) {
                input.value = dataObject[modelKey] || "";
            }
        });
    }

    calculateMathExpression(input) {
        const isExpression = /^[0-9+\-*/().\s]+$/.test(input);
        if (isExpression) {
            try {
                return Function(`return ${input}`)();
            } catch (e) {
                return 0;
            }
        } else {
            return parseInt(input) || 0;
        }
    }

}