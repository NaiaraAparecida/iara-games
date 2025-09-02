// js/page-index.js
import { loadGames } from './loader.js';
import { favorites } from './favorites.js';
import { card } from './ui.js';

const state = { search:'', genre:'Todos', price:'Todos', sort:'Relevância', fav:false };
let DATA = [];

function uniqueGenres(list){ return ['Todos', ...new Set(list.flatMap(g => g.genero || []))]; }
function matchFilters(g){
  const t = state.search.trim().toLowerCase();
  const okSearch = t ? (g.nome.toLowerCase().includes(t) || g.studio.toLowerCase().includes(t)) : true;
  const okGenre = state.genre === 'Todos' ? true : (g.genero || []).includes(state.genre);
  let okPrice = true;
  switch(state.price){
    case 'Até R$50': okPrice = g.preco < 50; break;
    case 'R$50–R$80': okPrice = g.preco >= 50 && g.preco < 80; break;
    case 'R$80–R$120': okPrice = g.preco >= 80 && g.preco < 120; break;
    case 'R$120+': okPrice = g.preco >= 120; break;
  }
  const okFav = state.fav ? favorites.has(g.slug) : true;
  return okSearch && okGenre && okPrice && okFav;
}
function sortList(list){
  switch(state.sort){
    case 'Preço: menor → maior': return list.sort((a,b)=> a.preco - b.preco);
    case 'Preço: maior → menor': return list.sort((a,b)=> b.preco - a.preco);
    case 'Ano: mais novo → antigo': return list.sort((a,b)=> b.ano - a.ano);
    case 'Ano: antigo → novo': return list.sort((a,b)=> a.ano - b.ano);
    default: return list;
  }
}

function bindFavClicks(root){
  root.querySelectorAll('.fav-ico').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault(); e.stopPropagation();
      favorites.toggle(btn.dataset.slug);
      render();
    });
  });
}

function render(){
  const grid = document.getElementById('grid');
  let list = DATA.filter(matchFilters);
  list = sortList(list);
  grid.innerHTML = list.length ? list.map(card).join('') : `<p>Nenhum jogo encontrado.</p>`;
  bindFavClicks(grid);
}

async function bootstrap(){
  DATA = await loadGames();

  const $ = s => document.querySelector(s);
  $('#genre').innerHTML = uniqueGenres(DATA).map(g => `<option value="${g}">${g}</option>`).join('');
  $('#price').innerHTML = ['Todos','Até R$50','R$50–R$80','R$80–R$120','R$120+'].map(p => `<option value="${p}">${p}</option>`).join('');
  $('#sort').innerHTML = ['Relevância','Preço: menor → maior','Preço: maior → menor','Ano: mais novo → antigo','Ano: antigo → novo'].map(s => `<option value="${s}">${s}</option>`).join('');

  $('#search').addEventListener('input', e=>{ state.search = e.target.value; render(); });
  $('#genre').addEventListener('change', e=>{ state.genre = e.target.value; render(); });
  $('#price').addEventListener('change', e=>{ state.price = e.target.value; render(); });
  $('#sort').addEventListener('change', e=>{ state.sort = e.target.value; render(); });
  $('#onlyFav').addEventListener('change', e=>{ state.fav = e.target.checked; render(); });
  $('#clear').addEventListener('click', ()=>{
    state.search=''; state.genre='Todos'; state.price='Todos'; state.sort='Relevância'; state.fav=false;
    $('#search').value=''; $('#genre').value='Todos'; $('#price').value='Todos'; $('#sort').value='Relevância'; $('#onlyFav').checked=false;
    render();
  });

  render();
}

bootstrap();
