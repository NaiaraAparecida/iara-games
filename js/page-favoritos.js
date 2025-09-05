import { loadGames } from './loader.js';
import { favorites } from './favorites.js';
import { card } from './ui.js';

function bindFavClicks(root, rerender) {
  root.querySelectorAll('.fav-ico').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      favorites.toggle(btn.dataset.slug);
      rerender();
    });
  });
}

async function bootstrap() {
  const grid = document.getElementById('grid');
  let data = await loadGames();

  const render = () => {
    const favs = new Set(favorites.list());
    const list = data.filter(g => favs.has(g.slug));
    grid.innerHTML = list.length
      ? list.map(card).join('')
      : `<div class="empty"><p>Nenhum favorito ainda.</p><a class="btn" href="../index.html">Voltar</a></div>`;
    bindFavClicks(grid, render);
  };

  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('iara:fav')) render();
  });

  render();
}
bootstrap();
