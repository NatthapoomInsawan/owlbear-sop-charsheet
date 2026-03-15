import AbstractView from "./AbstractView";

export default class character extends AbstractView{
    constructor() {
        super();
        this.setTitle("Character");
    }

    async getHtml(){
        return /*html*/`
        <h1>Character</h1>
        `
    }
}