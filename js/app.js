import {
    loadGames
} from 'data/loader.js';
import {
    favorites
} from 'favorites.js';


function pixelHeart(on = true) {
    if (on) {

        return `
      <svg class="heart-pixel" viewBox="0 0 9 8" aria-hidden="true">
        <!-- vermelho -->
        <g fill="#E53935">
          <rect x="1" y="0" width="1" height="1"/>
          <rect x="2" y="0" width="1" height="1"/>
          <rect x="6" y="0" width="1" height="1"/>
          <rect x="7" y="0" width="1" height="1"/>

          <rect x="0" y="1" width="1" height="1"/>
          <rect x="1" y="1" width="1" height="1"/>
          <rect x="2" y="1" width="1" height="1"/>
          <rect x="3" y="1" width="1" height="1"/>
          <rect x="5" y="1" width="1" height="1"/>
          <rect x="6" y="1" width="1" height="1"/>
          <rect x="7" y="1" width="1" height="1"/>
          <rect x="8" y="1" width="1" height="1"/>

          <rect x="0" y="2" width="1" height="1"/>
          <rect x="1" y="2" width="1" height="1"/>
          <rect x="2" y="2" width="1" height="1"/>
          <rect x="3" y="2" width="1" height="1"/>
          <rect x="4" y="2" width="1" height="1"/>
          <rect x="5" y="2" width="1" height="1"/>
          <rect x="6" y="2" width="1" height="1"/>
          <rect x="7" y="2" width="1" height="1"/>
          <rect x="8" y="2" width="1" height="1"/>

          <rect x="1" y="3" width="1" height="1"/>
          <rect x="2" y="3" width="1" height="1"/>
          <rect x="3" y="3" width="1" height="1"/>
          <rect x="4" y="3" width="1" height="1"/>
          <rect x="5" y="3" width="1" height="1"/>
          <rect x="6" y="3" width="1" height="1"/>
          <rect x="7" y="3" width="1" height="1"/>

          <rect x="2" y="4" width="1" height="1"/>
          <rect x="3" y="4" width="1" height="1"/>
          <rect x="4" y="4" width="1" height="1"/>
          <rect x="5" y="4" width="1" height="1"/>
          <rect x="6" y="4" width="1" height="1"/>

          <rect x="3" y="5" width="1" height="1"/>
          <rect x="4" y="5" width="1" height="1"/>
          <rect x="5" y="5" width="1" height="1"/>

          <rect x="4" y="6" width="1" height="1"/>
        </g>
        <!-- brilho -->
        <g fill="#FFFFFF">
          <rect x="1" y="1" width="1" height="1"/>
          <rect x="2" y="1" width="1" height="1"/>
        </g>
      </svg>
    `;
    } else {
        return `
      <svg class="heart-pixel" viewBox="0 0 9 8" aria-hidden="true">
        <!-- contorno em "pixel" -->
        <g fill="#111">
          <rect x="1" y="0" width="1" height="1"/>
          <rect x="2" y="0" width="1" height="1"/>
          <rect x="6" y="0" width="1" height="1"/>
          <rect x="7" y="0" width="1" height="1"/>

          <rect x="0" y="1" width="1" height="1"/>
          <rect x="4" y="1" width="1" height="1"/>
          <rect x="8" y="1" width="1" height="1"/>

          <rect x="0" y="2" width="1" height="1"/>
          <rect x="8" y="2" width="1" height="1"/>

          <rect x="1" y="3" width="1" height="1"/>
          <rect x="7" y="3" width="1" height="1"/>

          <rect x="2" y="4" width="1" height="1"/>
          <rect x="6" y="4" width="1" height="1"/>

          <rect x="3" y="5" width="1" height="1"/>
          <rect x="5" y="5" width="1" height="1"/>

          <rect x="4" y="6" width="1" height="1"/>
        </g>
      </svg>
    `;
    }
}

const $ = (sel, root = document) => root.querySelector(sel);
const currency = (v) => v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

const state = {
    search: '',
    genre: 'Todos',
    price: 'Todos',
    sort: 'Relevância',
    fav: false
};
let DATA = [];

function uniqueGenres(list) {
    const s = new Set(list.flatMap(g => g.genero));
    return ['Todos', ...Array.from(s)];
}

function matchFilters(g) {
    const t = state.search.trim().toLowerCase();
    const okSearch = t ? (g.nome.toLowerCase().includes(t) || g.studio.toLowerCase().includes(t)) : true;
    const okGenre = state.genre === 'Todos' ? true : g.genero.includes(state.genre);
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

function renderControls() {
    $('#genre').innerHTML = uniqueGenres(DATA).map(g => `<option value="${g}">${g}</option>`).join('');
    $('#price').innerHTML = ['Todos', 'Até R$50', 'R$50–R$80', 'R$80–R$120', 'R$120+'].map(p => `<option value="${p}">${p}</option>`).join('');
    $('#sort').innerHTML = ['Relevância', 'Preço: menor → maior', 'Preço: maior → menor', 'Ano: mais novo → antigo', 'Ano: antigo → novo'].map(s => `<option value="${s}">${s}</option>`).join('');
}

function card(g) {
    const isFav = favorites.has(g.slug);
    const pressed = String(isFav);

    return `
  <article class="card" tabindex="0" aria-labelledby="${g.slug}-title">
    <a href="./game.html?slug=${g.slug}" aria-label="Ver detalhes de ${g.nome}">
      <img src="${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
    </a>

    <button class="fav-ico" data-slug="${g.slug}" aria-pressed="${pressed}"
            aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
      ${pixelHeart(isFav)}
    </button>

    <div class="body">
      <h3 id="${g.slug}-title">${g.nome}</h3>
      <div class="meta">
        <span class="badge">${g.studio}</span>
        ${g.genero.map(x => `<span class="badge" aria-label="Gênero: ${x}">${x}</span>`).join('')}
        <span class="badge" aria-label="Ano de lançamento">${g.ano}</span>
      </div>
      <div class="actions">
        <span class="price">${currency(g.preco)}</span>
        <a class="btn" href="${g.link}" target="_blank" rel="noopener">Comprar</a>
      </div>
    </div>
  </article>`;
}



function renderList() {
    const grid = document.querySelector('[data-grid]');
    let list = DATA.filter(matchFilters);
    list = sortList(list);
    grid.innerHTML = list.length ? list.map(card).join('') : `<p role="status">Nenhum jogo encontrado.</p>`;
    grid.querySelectorAll('.fav-ico').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            favorites.toggle(btn.dataset.slug);
            renderList();
        });
    });
}

function bindEvents() {
    $('#search').addEventListener('input', e => {
        state.search = e.target.value;
        renderList();
    });
    $('#genre').addEventListener('change', e => {
        state.genre = e.target.value;
        renderList();
    });
    $('#price').addEventListener('change', e => {
        state.price = e.target.value;
        renderList();
    });
    $('#sort').addEventListener('change', e => {
        state.sort = e.target.value;
        renderList();
    });
    const favBox = document.getElementById('onlyFav');
    if (favBox) favBox.addEventListener('change', e => {
        state.fav = e.target.checked;
        renderList();
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
        if (favBox) favBox.checked = false;
        renderList();
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    DATA = await loadGames();
    renderControls();
    bindEvents();
    renderList();
});