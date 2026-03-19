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
        `
    }
}