import AbstractController from "./abstractController.js";
import CharacterData, {getDerivedStats, getDerivedSkill, addWeapon, removeWeapon, addSkill, removeSkill} from "../models/characterData.js";
import {CHARACTER_CLASS, CHARACTER_SUBCLASS, CHARACTER_LINEAGE, CHARACTER_ATTRIBUTES} from "../models/sopData.js";

import OBR from "@owlbear-rodeo/sdk";

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

                    const attributeChangeEvent = new CustomEvent("character-attribute-changed", { 
                        detail: { attribute: attributeKey, value: CharacterData[attributeKey] } 
                    });
                    document.dispatchEvent(attributeChangeEvent);
                }
            }

        });

        document.addEventListener("focusout", (event) => {
            const modelKey = event.target.dataset.character;
            let value = event.target.value;

            if (modelKey && modelKey in CharacterData) {

                if (event.target.hasAttribute("calc-field")) {
                    value = this.calculateMathExpression(value);
                    event.target.value = value; // Update the input with the calculated value
                }

                CharacterData[modelKey] = value;
            }

            if (event.target.hasAttribute("data-character-skill")){
                const skillName = event.target.getAttribute("data-character-skill");
                const derivedSkill = getDerivedSkill(skillName);      
                if (derivedSkill){
                    CharacterData[skillName] = derivedSkill > value ? derivedSkill : value;
                    event.target.value = CharacterData[skillName];
                }
            }
        });

        document.getElementById("add-weapon-btn").addEventListener("click", () => {
            this.createWeapon();
        });

        document.getElementById("add-skill-btn").addEventListener("click", () => {
            this.createSkill();
        });

        document.getElementById("test-dice-btn")?.addEventListener("click", async () => {
            console.log("Rolling 3D6...");
            document.querySelector('dice-roller').openRollPanel(3);
        });

        this.bindContainerReordering(".character-weapons dragable-container", "weapon");
        this.bindContainerReordering(".character-skills dragable-container", "skill");
    }

    initData(){
        this.syncCharacterInput(CharacterData);

        this.populateDataList("character-class", CHARACTER_CLASS);
        this.populateDataList("character-subclass", CHARACTER_SUBCLASS);
        this.populateDataList("character-lineage", CHARACTER_LINEAGE);

        this.syncCharacterWeapons(CharacterData);
        this.syncCharacterSkills(CharacterData);
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

    bindContainerReordering(containerSelector, dataKey) {
        const container = document.querySelector(containerSelector);
        container.onChildReorder = () => {
            const updatedData = Array.from(container.children).map((element, index) => {
                const itemData = element[`${dataKey}Data`];
                element.id = `${dataKey}-${index + 1}`;
                return itemData;
            });
            CharacterData[`${dataKey}s`] = updatedData;
        };
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

        newWeapon.querySelectorAll('input').forEach(input => {
            input.addEventListener("input", (event) => {
                const inputName = event.target.getAttribute("name");
                const weaponData = newWeapon.weaponData;
                if (weaponData && inputName)
                    weaponData[inputName] = event.target.type === "number" ? parseInt(event.target.value) || 0 : event.target.value;
            });
        });

        newWeapon.onRemove = (weaponElement) => {
            const weaponIndex = Array.from(container.children).indexOf(weaponElement);
            removeWeapon(weaponIndex);
        };
        
        container.appendChild(newWeapon);
    }

    syncCharacterSkills(characterData) {
        characterData.skills.forEach(skill => {
            this.createSkill(skill, true);
        });
    }

    createSkill(skillData, isSync = false) {
        const container = document.querySelector(".character-skills dragable-container");
        const newSkill = document.createElement("draggable-item");

        if (!isSync)
            skillData = addSkill("", "might", 0);

        newSkill.skillData = skillData;

        newSkill.id = `skill-${container.children.length + 1}`;
        newSkill.innerHTML = /* HTML */ `
            <input name="name" placeholder="name" value="${skillData.name}">
            <select name="attribute" value="${skillData.attribute}">
                ${CHARACTER_ATTRIBUTES.map(attribute => `<option value="${attribute}" ${attribute === skillData.attribute ? "selected" : ""}>${attribute}</option>`).join("")}
            </select>
            <input name="rank" placeholder="rank" type="number" min="0" value="${skillData.rank}">
            <label name="result">${skillData.value}</label>
        `;

        newSkill.querySelectorAll('input').forEach(input => {
            input.addEventListener("input", (event) => {
                const inputName = event.target.getAttribute("name");
                const skillData = newSkill.skillData;
                if (skillData && inputName)
                    skillData[inputName] = event.target.type === "number" ? parseInt(event.target.value) || 0 : event.target.value;
                recalculateSkillResults();
            });
        });

        newSkill.querySelector('select[name="attribute"]').addEventListener("change", (event) => {
            const attribute = event.target.value;
            newSkill.skillData.attribute = attribute;
            recalculateSkillResults();
        });

        document.addEventListener("character-attribute-changed", recalculateSkillResults);

        newSkill.onRemove = (skillElement) => {
            const skillIndex = Array.from(container.children).indexOf(skillElement);
            document.removeEventListener("character-attribute-changed", recalculateSkillResults);
            removeSkill(skillIndex);
        };


        container.appendChild(newSkill);

        updateSkillInputField();

        function recalculateSkillResults(){
            const rank = parseInt(newSkill.querySelector('input[name="rank"]').value) || 0;
            const attribute = newSkill.querySelector('select[name="attribute"]').value;
            const resultLabel = newSkill.querySelector('label[name="result"]');
            
            newSkill.skillData.value = rank + (Number(CharacterData[attribute]) || 0);
            resultLabel.textContent = newSkill.skillData.value;

            updateSkillInputField();
        }

        function updateSkillInputField(){
            const derivedSkill = getDerivedSkill(newSkill.skillData.name);

            if (derivedSkill)
                CharacterData[newSkill.skillData.name] = derivedSkill;

            document.querySelectorAll(`input[data-character-skill="${newSkill.skillData.name}"]`).forEach((input)=>{
                input.value = derivedSkill ? derivedSkill : newSkill.skillData.value;
            });
        }
    }

}