import Character from "./views/character";
import Equipment from "./views/equipment";
import SpecialTrait from "./views/specialTrait";
import Spell from "./views/spell";

export const route = url =>{
    history.pushState(null, null, url);
    findMatchView();
};

const routes = [
    { path: "/", view: Character },
    { path: "/equipment", view: Equipment},
    { path: "/special-trait", view: SpecialTrait},
    { path: "/spell", view: Spell},
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
    document.querySelector("#content").innerHTML = await view.getHtml();

};

window.addEventListener("popstate", findMatchView);

document.addEventListener("DOMContentLoaded", ()=>{
    document.addEventListener("click", (event) =>{
        if (event.target.matches("[data-link]")){
            event.preventDefault();
            route(event.target.href);
        }
    });
    route();
});
