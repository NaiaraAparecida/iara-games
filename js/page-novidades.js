import { loadGames } from './loader.js';
import { card } from './ui.js';
import { favorites } from './favorites.js';

function ytEmbed(urlOrId){
  const m = String(urlOrId).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  const id = m ? m[1] : urlOrId;
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
}

function bindFavClicks(root) {
  root.querySelectorAll('.fav-ico').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      favorites.toggle(btn.dataset.slug);
      btn.classList.add('animated');
      setTimeout(() => btn.classList.remove('animated'), 250);
    });
  });
}

async function bootstrap(){
  const data = await loadGames();
  const novidades = data.filter(g => g.featured || g.ano >= 2021);

  const destaque = novidades.find(g => g.trailer) || novidades[0];
  const destEl = document.getElementById('destaque');
  if(destEl && destaque){
    const prefix = location.pathname.includes('/pages/') ? '../' : '';
    destEl.innerHTML = `
      <article class="card">
        <img src="${prefix}${destaque.img}" alt="Capa de ${destaque.nome}">
        <div class="body">
          <h2>${destaque.nome}</h2>
          <p class="muted">${destaque.studio} • ${destaque.ano}</p>
          ${destaque.descricao ? `<p>${destaque.descricao}</p>` : ''}
          ${destaque.trailer ? ytEmbed(destaque.trailer) : ''}
        </div>
      </article>`;
  }

  const grid = document.getElementById('grid');
  const outras = novidades.filter(g => g !== destaque).slice(0, 12);
  grid.innerHTML = outras.length ? outras.map(card).join('') : '<p>Nada ainda.</p>';
  bindFavClicks(grid);
}
bootstrap();
