// js/page-index.js
import {
  loadGames
} from './loader.js';
import {
  favorites
} from './favorites.js';
import {
  card
} from './ui.js';

const state = {
  search: '',
  genre: 'Todos',
  price: 'Todos',
  sort: 'Relevância',
  fav: false
};
let DATA = [];

/* ---------- URL <-> estado ---------- */
function readParams() {
  const p = new URLSearchParams(location.search);
  state.search = p.get('q') || '';
  state.genre = p.get('genre') || 'Todos';
  state.price = p.get('price') || 'Todos';
  state.sort = p.get('sort') || 'Relevância';
  state.fav = p.get('fav') === '1';
}

function writeParams() {
  const p = new URLSearchParams();
  if (state.search) p.set('q', state.search);
  if (state.genre !== 'Todos') p.set('genre', state.genre);
  if (state.price !== 'Todos') p.set('price', state.price);
  if (state.sort !== 'Relevância') p.set('sort', state.sort);
  if (state.fav) p.set('fav', '1');
  const q = p.toString();
  history.replaceState(null, '', q ? ('?' + q) : location.pathname);
}

/* ---------- helpers ---------- */
function uniqueGenres(list) {
  return ['Todos', ...new Set(list.flatMap(g => g.genero || []))];
}

function matchFilters(g) {
  const t = state.search.trim().toLowerCase();
  const okSearch = t ? (g.nome.toLowerCase().includes(t) || g.studio.toLowerCase().includes(t)) : true;
  const okGenre = state.genre === 'Todos' ? true : (g.genero || []).includes(state.genre);
  let okPrice = true;
  switch (state.price) {
    case 'Até R$50':
      okPrice = g.preco < 50;
      break;
    case 'R$50–R$80':
      okPrice = g.preco >= 50 && g.preco < 80;
      break;
    case 'R$80–R$120':
      okPrice = g.preco >= 80 && g.preco < 120;
      break;
    case 'R$120+':
      okPrice = g.preco >= 120;
      break;
  }
  const okFav = state.fav ? favorites.has(g.slug) : true;
  return okSearch && okGenre && okPrice && okFav;
}

function sortList(list) {
  switch (state.sort) {
    case 'Popularidade':
      return favorites.rankByPopularity(list);
    case 'Preço: menor → maior':
      return list.sort((a, b) => a.preco - b.preco);
    case 'Preço: maior → menor':
      return list.sort((a, b) => b.preco - a.preco);
    case 'Ano: mais novo → antigo':
      return list.sort((a, b) => b.ano - a.ano);
    case 'Ano: antigo → novo':
      return list.sort((a, b) => a.ano - b.ano);
    default:
      return list;
  }
}

/* ---------- skeleton ---------- */
function renderSkeleton(n = 6) {
  const grid = document.getElementById('grid');
  grid.innerHTML = Array.from({
    length: n
  }).map(() => `
    <article class="card skeleton">
      <div class="skeleton-img"></div>
      <div class="body">
        <div class="line skeleton-line" style="width:70%"></div>
        <div class="line skeleton-line" style="width:50%"></div>
        <div class="line skeleton-line" style="width:30%"></div>
      </div>
    </article>`).join('');
}

/* ---------- render ---------- */
function bindFavClicks(root) {
  root.querySelectorAll('.fav-ico').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      favorites.toggle(btn.dataset.slug);
      btn.classList.add('animated');
      setTimeout(() => btn.classList.remove('animated'), 250);
      render();
      writeParams();
    });
  });
}

function render() {
  const grid = document.getElementById('grid');
  let list = DATA.filter(matchFilters);
  list = sortList(list);
  grid.innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><p>Nenhum jogo encontrado.</p></div>`;
  bindFavClicks(grid);
}

/* ---------- bootstrap ---------- */
async function bootstrap() {
  renderSkeleton();
  DATA = await loadGames();
  readParams();

  const $ = s => document.querySelector(s);
  // popular selects
  $('#sort').innerHTML = ['Relevância', 'Popularidade', 'Preço: menor → maior', 'Preço: maior → menor', 'Ano: mais novo → antigo', 'Ano: antigo → novo']
    .map(s => `<option value="${s}">${s}</option>`).join('');
  $('#genre').innerHTML = uniqueGenres(DATA).map(g => `<option value="${g}">${g}</option>`).join('');
  $('#price').innerHTML = ['Todos', 'Até R$50', 'R$50–R$80', 'R$80–R$120', 'R$120+'].map(p => `<option value="${p}">${p}</option>`).join('');
  $('#sort').innerHTML = ['Relevância', 'Preço: menor → maior', 'Preço: maior → menor', 'Ano: mais novo → antigo', 'Ano: antigo → novo'].map(s => `<option value="${s}">${s}</option>`).join('');

  // UI ← estado
  $('#search').value = state.search;
  $('#genre').value = state.genre;
  $('#price').value = state.price;
  $('#sort').value = state.sort;
  $('#onlyFav').checked = state.fav;

  const onChange = () => {
    render();
    writeParams();
  };
  $('#search').addEventListener('input', e => {
    state.search = e.target.value;
    onChange();
  });
  $('#genre').addEventListener('change', e => {
    state.genre = e.target.value;
    onChange();
  });
  $('#price').addEventListener('change', e => {
    state.price = e.target.value;
    onChange();
  });
  $('#sort').addEventListener('change', e => {
    state.sort = e.target.value;
    onChange();
  });
  $('#onlyFav').addEventListener('change', e => {
    state.fav = e.target.checked;
    onChange();
  });

  $('#clear').addEventListener('click', () => {
    state.search = '';
    state.genre = 'Todos';
    state.price = 'Todos';
    state.sort = 'Relevância';
    state.fav = false;
    $('#search').value = '';
    $('#genre').value = 'Todos';
    $('#price').value = 'Todos';
    $('#sort').value = 'Relevância';
    $('#onlyFav').checked = false;
    onChange();
  });

  render();
  writeParams();
}
bootstrap();