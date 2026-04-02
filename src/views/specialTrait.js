import AbstractView from "./abstractView.js";

export default class SpecialTrait extends AbstractView{
    constructor() {
        super();
        this.setTitle("Special Trait");
    }

    async getHtml(){
        return /*html*/`
        <h1>Special Trait</h1>
        `
    }
}