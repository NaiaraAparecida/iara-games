import { loadGames } from './loader.js';
import { favorites } from './favorites.js';
import { card } from './ui.js';

async function bootstrap(){
  const data = await loadGames();
  const favs = new Set(favorites.list());
  const list = data.filter(g => favs.has(g.slug));
  const grid = document.getElementById('grid');
  grid.innerHTML = list.length ? list.map(card).join('') : '<p>Nenhum favorito ainda.</p>';
}
bootstrap();
