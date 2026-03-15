import AbstractView from "./AbstractView";

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