// js/page-novidades.js
import { loadGames } from './loader.js';
import { card } from './ui.js';

function ytEmbed(urlOrId){
  const m = String(urlOrId).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  const id = m ? m[1] : urlOrId;
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}"
    title="YouTube player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}

async function bootstrap(){
  const data = await loadGames();
  const novidades = data.filter(g => g.featured || g.ano >= 2021);

  const destaque = novidades.find(g => g.trailer) || novidades[0];
  const destEl = document.getElementById('destaque');
  if(destEl && destaque){
    const IN_PAGES = location.pathname.includes('/pages/');
    const IMG_PREFIX = IN_PAGES ? '../' : '';
    destEl.innerHTML = `
      <article class="card">
        <img src="${IMG_PREFIX}${destaque.img}" alt="Capa de ${destaque.nome}">
        <div class="body">
          <h2>${destaque.nome}</h2>
          <p class="muted">${destaque.studio} • ${destaque.ano} • ${(destaque.genero||[]).join(', ')}</p>
          ${destaque.descricao ? `<p>${destaque.descricao}</p>` : ''}
          ${destaque.trailer ? `<div class="media" style="margin-top:12px">${ytEmbed(destaque.trailer)}</div>` : ''}
        </div>
      </article>`;
  }

  const grid = document.getElementById('grid');
  const outras = novidades.filter(g => g !== destaque).slice(0, 12);
  grid.innerHTML = outras.length ? outras.map(card).join('') : '<p>Nada por aqui ainda.</p>';
}
bootstrap();
