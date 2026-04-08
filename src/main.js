import './style.css';
import javascriptLogo from './assets/javascript.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { route } from './router';

import './components/dragableRemover';

document.querySelector('#app').innerHTML = 
/*html*/`
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${javascriptLogo}" class="framework" alt="JavaScript logo"/>
    <img src=${viteLogo} class="vite" alt="Vite logo" />
  </div>
  <div class= "nav-menu">
    <nav>
      <a href="/" data-link>character</a> |
      <a href="/equipment" data-link>equipment</a> |
      <a href="/special-trait" data-link>special trait</a> |
      <a href="/spell" data-link>spell</a>
    </nav>
  </div>
  <div id="content">
  </div>
  <dragable-remover>
  </dragable-remover>
</section>
`

route();