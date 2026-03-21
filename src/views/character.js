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
        <div id = "character-quick-access">
            <div class = "character-attributes">
                <h3>ATTRIBUTES</h3>
                <label>MIGHT <input type = "number" step = "1" min = "1" max = "4" placeholder = "might" data-character = "might"></label>
                <label>TOUGHNESS <input type = "number" step = "1" min = "1" max = "4" placeholder = "toughness" data-character = "toughness"></label>
                <label>AGILITY <input type = "number" step = "1" min = "1" max = "4" placeholder = "agility" data-character = "agility"></label>
                <label>WILLPOWER <input type = "number" step = "1" min = "1" max = "4" placeholder = "willpower" data-character = "willpower"></label>
                <label>INTELLIGENCE <input type = "number" step = "1" min = "1" max = "4" placeholder = "intelligence" data-character = "intelligence"></label>
                <label>FATE <input type = "number" step = "1" min = "1" max = "4" placeholder = "fate" data-character = "fate"></label>
            </div>
        </div>
        `
    }
}