import AbstractController from "./abstractController.js";
import CharacterData, {getDerivedStats, addWeapon, removeWeapon} from "../models/characterData.js";
import {CHARACTER_CLASS, CHARACTER_SUBCLASS, CHARACTER_LINEAGE} from "../models/sopData.js";

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

                    const min = event.target.getAttribute("min");
                    const max = event.target.getAttribute("max");

                    if (min !== null) value = Math.max(Number(min), value);
                    if (max !== null) value = Math.min(Number(max), value);
                    event.target.value = value;
                }

                CharacterData[modelKey] = event.target.value;

                if (event.target.hasAttribute("character-attribute")) {
                    let attributeKey = event.target.getAttribute("character-attribute");
                    let derivedStats = getDerivedStats(attributeKey);
                    derivedStats.forEach(derivedStat => {
                        const derivedInput = document.querySelector(`[data-character="${derivedStat}"]`);
                        if (derivedInput) {
                            derivedInput.value = CharacterData[attributeKey];
                            CharacterData[derivedStat] = CharacterData[attributeKey];
                        }
                    });

                }
            }

            if (event.target.closest(".weapon-row")) {
                const weaponElement = event.target.closest("draggable-item");
                if (weaponElement && weaponElement.weaponData){
                    const inputName = event.target.getAttribute("name");
                    const weaponData = weaponElement.weaponData;
                    if (weaponData && inputName)
                        weaponData[inputName] = event.target.type === "number" ? parseInt(event.target.value) || 0 : event.target.value;
                }
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

        document.getElementById("add-weapon-btn").addEventListener("click", () => {
            this.createWeapon();
        });

        const weaponContainer = document.querySelector(".character-weapons dragable-container");
        weaponContainer.onChildReorder = () => {
            const updatedWeapons = Array.from(weaponContainer.children).map((el, index) => {
                const weaponData = el.weaponData;
                el.id = `weapon-${index + 1}`;
                return weaponData;
            });
            CharacterData.weapons = updatedWeapons;
        };
    }

    initData(){
        this.syncCharacterInput(CharacterData);

        this.populateDataList("character-class", CHARACTER_CLASS);
        this.populateDataList("character-subclass", CHARACTER_SUBCLASS);
        this.populateDataList("character-lineage", CHARACTER_LINEAGE);

        this.syncCharacterWeapons(CharacterData);
    }

    syncCharacterInput(dataObject) {
        const inputs = document.querySelectorAll("[data-character]");
        inputs.forEach(input => {
            const modelKey = input.dataset.character;
            if (modelKey in dataObject) {
                const fallback = input.type === "number" ? 0 : "";
                input.value = dataObject[modelKey] ?? fallback;
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

    syncCharacterWeapons(characterData) {
        characterData.weapons.forEach(weapon => {
            this.createWeapon(weapon, true);
        });
    }

    createWeapon(weaponData, isSync = false) {
        const container = document.querySelector(".character-weapons dragable-container");
        const newWeapon = document.createElement("draggable-item");
        
        if (!isSync)
            weaponData = addWeapon("", "", 0, "");

        newWeapon.weaponData = weaponData;

        newWeapon.id = `weapon-${container.children.length + 1}`;
        newWeapon.innerHTML = /* HTML */ `
            <input name="name" placeholder="name" value="${weaponData.name}">
            <input name="range" placeholder="range" value="${weaponData.range}">
            <input name="damage" placeholder="damage" type="number" min="0" value="${weaponData.damage}">
            <input name="traits" placeholder="traits" value="${weaponData.traits}">
        `;

        newWeapon.onRemove = (weaponElement) => {
            const weaponIndex = Array.from(container.children).indexOf(weaponElement);
            removeWeapon(weaponIndex);
        };
        
        container.appendChild(newWeapon);
    }

}