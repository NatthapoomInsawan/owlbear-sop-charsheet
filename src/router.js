import Character from "./views/character";
import Equipment from "./views/equipment";
import SpecialTrait from "./views/specialTrait";
import Spell from "./views/spell";

import CharacterController from "./controllers/characterController";
import EquipmentController from "./controllers/equipmentController";
import SpecialTraitController from "./controllers/specialTraitController";
import SpellController from "./controllers/spellController";

export const route = url =>{
    history.pushState(null, null, url);
    findMatchView();
};

const routes = [
    { path: "/", view: Character, controller: CharacterController },
    { path: "/equipment", view: Equipment, controller: EquipmentController },
    { path: "/special-trait", view: SpecialTrait, controller: SpecialTraitController },
    { path: "/spell", view: Spell, controller: SpellController },
];

const findMatchView = async () =>{
    let match = routes.map(route => {
        return {
            route: route,
            isMatch: route.path == location.pathname
        };
    }).find( route => route.isMatch);

    if (!match){
        match = {
            route: routes[0],
            isMatch: true
        };
    }

    let view = new match.route.view();
    let controller = new match.route.controller();

    document.querySelector("#content").innerHTML = await view.getHtml();
    
    controller.init();
};

window.addEventListener("popstate", findMatchView);

document.addEventListener("DOMContentLoaded", ()=>{
    document.addEventListener("click", (event) =>{
        if (event.target.matches("[data-link]")){
            route(event.target.getAttribute("href"));
        }
    });
    route();
});
