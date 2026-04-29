import "../CSS/character.css";

import AbstractView from "./abstractView.js";

import '../components/dragableItem.js';
import '../components/dragableContainer.js';

export default class Character extends AbstractView {
    constructor() {
        super();
        this.setTitle("Character");
    }

    async getHtml() {
        return /*html*/`
        <div class = "character-header">
            <h1>Character</h1>
        </div>
        <div class = "character-info">
            <label>CHARACTER <input placeholder = "name" data-character = "characterName"></label>
            <label>PLAYER <input placeholder = "name" data-character = "playerName"></label>
            <label>CLASS <input placeholder = "class" data-character = "characterClass" list = "character-class"></label>
            <label>SUBCLASS <input placeholder = "subclass" data-character = "characterSubclass" list = "character-subclass"></label>
            <label>LINEAGE <input placeholder = "lineage" data-character = "characterLineage" list = "character-lineage"></label>
            <label>AMBITION <input placeholder = "ambitions" data-character = "characterAmbition"></label>
        </div>
        <div class = "character-stats">
            <div class = "character-attributes">
                <h3>ATTRIBUTES</h3>
                <label class = "rollable-click">MIGHT <input type = "number" step = "1" min = "1" max = "4" placeholder = "might" data-character = "might" character-attribute = "might"></label>
                <label class = "rollable-click">TOUGHNESS <input type = "number" step = "1" min = "1" max = "4" placeholder = "toughness" data-character = "toughness" character-attribute = "toughness"></label>
                <label class = "rollable-click">AGILITY <input type = "number" step = "1" min = "1" max = "4" placeholder = "agility" data-character = "agility" character-attribute = "agility"></label>
                <label class = "rollable-click">WILLPOWER <input type = "number" step = "1" min = "1" max = "4" placeholder = "willpower" data-character = "willpower" character-attribute = "willpower"></label>
                <label class = "rollable-click">INTELLIGENCE <input type = "number" step = "1" min = "1" max = "4" placeholder = "intelligence" data-character = "intelligence" character-attribute = "intelligence"></label>
                <label class = "rollable-click">FATE <input type = "number" step = "1" min = "1" max = "4" placeholder = "fate" data-character = "fate" character-attribute = "fate"></label>
            </div>
            <div class = "character-derived-fields">
                <label class = "rollable-click">GRIT <input type = "number" step = "1" min = "0" placeholder = "grit" data-character = "grit" data-character-skill = "grit"></label>
                <label class = "rollable-click">INIT <input type = "number" step = "1" min = "0" placeholder = "initiative" data-character = "initiative"></label>
                <label class = "rollable-click">LUCK <input type = "number" step = "1" min = "0" placeholder = "luck" data-character = "luck"></label>
                <label class = "rollable-click">ARMOR <input type = "number" step = "1" min = "0" placeholder = "armor" data-character = "armor"></label>
            </div>
        </div>
        <div class = "character-weapons">
            <h3>WEAPONS</h3>
            <div class = "weapon-column">
                <label>WEAPON</label>
                <label>RNG</label>
                <label>DMG</label>
                <label>TRAITS</label>
            </div>
            <dragable-container class = "weapon-row" lock-child>
            </dragable-container>
            <button id = "add-weapon-btn">Add Weapon</button>
        </div>
        <div class = "character-skills">
            <h3>SKILLS</h3>
            <div class = "skill-column">
                <label>SKILL</label>
                <label>ATTRIBUTE</label>
                <label>RANK</label>
                <label>RESULT</label>
            </div>
            <dragable-container class = "skill-row" lock-child>
            </dragable-container>
            <button id = "add-skill-btn">Add Skill</button>
        </div>
        `
    }
}