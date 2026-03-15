import AbstractView from "./AbstractView";

export default class Spell extends AbstractView{
    constructor() {
        super();
        this.setTitle("Spell");
    }

    async getHtml(){
        return /*html*/`
        <h1>Spell</h1>
        `
    }
}