import { loadGames } from './loader.js';
import { card } from './ui.js';

async function bootstrap(){
  const data = await loadGames();
  const lista = data.filter(g => g.featured || g.ano >= 2021);
  const grid = document.getElementById('grid');
  grid.innerHTML = lista.length ? lista.map(card).join('') : '<p>Nada por aqui ainda.</p>';
}
bootstrap();

