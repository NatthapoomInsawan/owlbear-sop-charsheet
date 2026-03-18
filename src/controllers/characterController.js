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
                CharacterData[modelKey] = event.target.value;
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

}