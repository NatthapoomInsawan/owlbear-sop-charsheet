export default class AbstractController {
    constructor() {
    }

    init() {
        this.bindEvents();
        this.initData();
    }

    bindEvents() {

    }

    initData(){

    }

    /**
     * Popolate datalist
     * @param {string} dataName - attribute (e.g., "[char-name-input]")
     * @param {Array} dataList - The data to insert
     */
    populateDataList(dataName, dataList){
        let dataListElement = document.getElementById(dataName);
        
        if (dataListElement) {
            dataListElement.innerHTML = ""; // Clear old options if it exists
        } else {
            dataListElement = document.createElement("datalist");
            dataListElement.id = String(dataName);
            document.body.appendChild(dataListElement);
        }

        const fragment = document.createDocumentFragment();

        dataList.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            fragment.appendChild(option);
        });

        document.body.appendChild(dataListElement);
        dataListElement.appendChild(fragment);
    }
}