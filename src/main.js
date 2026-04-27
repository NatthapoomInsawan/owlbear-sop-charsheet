import "./style.css";
import javascriptLogo from "./assets/javascript.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { route } from "./router";

import "./components/dragableRemover.js";
import "./components/diceRoller.js";
import "./components/toggleGroup.js";
import "./components/selectToggle.js";

document.querySelector("#app").innerHTML = /*html*/ `
<section>
    <div>

    </div>
</section>
<section id="center">
  <dice-roller></dice-roller>
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${javascriptLogo}" class="framework" alt="JavaScript logo"/>
    <img src=${viteLogo} class="vite" alt="Vite logo" />
  </div>
  <div class= "nav-menu">
    <toggle-group class="toggle-group" limit-select="1">
      <select-toggle href="/" data-link is-selected = "true">Character</select-toggle>
      <select-toggle href="/equipment" data-link>Equipment</select-toggle>
      <select-toggle href="/special-trait" data-link>Special Trait</select-toggle>
      <select-toggle href="/spell" data-link>Spell</select-toggle>
    </toggle-group>
  </div>
  <div id="content">
  </div>
  <dragable-remover>
  </dragable-remover>
</section>
`;

route();
