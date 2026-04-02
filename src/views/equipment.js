import AbstractView from "./abstractView.js";

export default class Equipment extends AbstractView{
    constructor() {
        super();
        this.setTitle("Equipment");
    }

    async getHtml(){
        return /*html*/`
        <h1>Equipment</h1>
        `
    }
}