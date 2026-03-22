import "../CSS/character.css";

import AbstractView from "./AbstractView";

export default class Character extends AbstractView{
    constructor() {
        super();
        this.setTitle("Character");
    }

    async getHtml(){
        return /*html*/`
        <h1>Character</h1>
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
                <label>MIGHT <input type = "number" step = "1" min = "1" max = "4" placeholder = "might" data-character = "might" character-attribute = "might"></label>
                <label>TOUGHNESS <input type = "number" step = "1" min = "1" max = "4" placeholder = "toughness" data-character = "toughness" character-attribute = "toughness"></label>
                <label>AGILITY <input type = "number" step = "1" min = "1" max = "4" placeholder = "agility" data-character = "agility" character-attribute = "agility"></label>
                <label>WILLPOWER <input type = "number" step = "1" min = "1" max = "4" placeholder = "willpower" data-character = "willpower" character-attribute = "willpower"></label>
                <label>INTELLIGENCE <input type = "number" step = "1" min = "1" max = "4" placeholder = "intelligence" data-character = "intelligence" character-attribute = "intelligence"></label>
                <label>FATE <input type = "number" step = "1" min = "1" max = "4" placeholder = "fate" data-character = "fate" character-attribute = "fate"></label>
            </div>
            <div class = "character-derived-fields">
                <label>GRIT <input type = "number" step = "1" min = "0" placeholder = "grit" data-character = "grit"></label>
                <label>INIT <input type = "number" step = "1" min = "0" placeholder = "initiative" data-character = "initiative"></label>
                <label>LUCK <input type = "number" step = "1" min = "0" placeholder = "luck" data-character = "luck"></label>
                <label>ARMOR <input type = "number" step = "1" min = "0" placeholder = "armor" data-character = "armor"></label>
            </div>
        </div>
        `
    }
}