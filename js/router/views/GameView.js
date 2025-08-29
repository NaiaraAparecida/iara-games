// /js/router/views/GameView.js
import {
    loadGames
} from '../../data/loader.js';
import {
    favorites
} from '../../favorites.js';

function pixelHeart(on = true) {
    return on ? `
    <svg class="heart-pixel" viewBox="0 0 9 8" aria-hidden="true">
      <g fill="#E53935">
        <rect x="1" y="0" width="1" height="1"/><rect x="2" y="0" width="1" height="1"/>
        <rect x="6" y="0" width="1" height="1"/><rect x="7" y="0" width="1" height="1"/>
        <rect x="0" y="1" width="1" height="1"/><rect x="1" y="1" width="1" height="1"/>
        <rect x="2" y="1" width="1" height="1"/><rect x="3" y="1" width="1" height="1"/>
        <rect x="5" y="1" width="1" height="1"/><rect x="6" y="1" width="1" height="1"/>
        <rect x="7" y="1" width="1" height="1"/><rect x="8" y="1" width="1" height="1"/>
        <rect x="0" y="2" width="1" height="1"/><rect x="1" y="2" width="1" height="1"/>
        <rect x="2" y="2" width="1" height="1"/><rect x="3" y="2" width="1" height="1"/>
        <rect x="4" y="2" width="1" height="1"/><rect x="5" y="2" width="1" height="1"/>
        <rect x="6" y="2" width="1" height="1"/><rect x="7" y="2" width="1" height="1"/>
        <rect x="8" y="2" width="1" height="1"/>
        <rect x="1" y="3" width="1" height="1"/><rect x="2" y="3" width="1" height="1"/>
        <rect x="3" y="3" width="1" height="1"/><rect x="4" y="3" width="1" height="1"/>
        <rect x="5" y="3" width="1" height="1"/><rect x="6" y="3" width="1" height="1"/>
        <rect x="7" y="3" width="1" height="1"/>
        <rect x="2" y="4" width="1" height="1"/><rect x="3" y="4" width="1" height="1"/>
        <rect x="4" y="4" width="1" height="1"/><rect x="5" y="4" width="1" height="1"/>
        <rect x="6" y="4" width="1" height="1"/>
        <rect x="3" y="5" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/>
        <rect x="5" y="5" width="1" height="1"/>
        <rect x="4" y="6" width="1" height="1"/>
      </g>
      <g fill="#FFFFFF"><rect x="1" y="1" width="1" height="1"/><rect x="2" y="1" width="1" height="1"/></g>
    </svg>` :
        `<svg class="heart-pixel" viewBox="0 0 9 8" aria-hidden="true"><g fill="#111">
      <rect x="1" y="0" width="1" height="1"/><rect x="2" y="0" width="1" height="1"/>
      <rect x="6" y="0" width="1" height="1"/><rect x="7" y="0" width="1" height="1"/>
      <rect x="0" y="1" width="1" height="1"/><rect x="4" y="1" width="1" height="1"/><rect x="8" y="1" width="1" height="1"/>
      <rect x="0" y="2" width="1" height="1"/><rect x="8" y="2" width="1" height="1"/>
      <rect x="1" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/>
      <rect x="2" y="4" width="1" height="1"/><rect x="6" y="4" width="1" height="1"/>
      <rect x="3" y="5" width="1" height="1"/><rect x="5" y="5" width="1" height="1"/>
      <rect x="4" y="6" width="1" height="1"/></g></svg>`;
}

export const GameView = {
    async render(slug) {
        const data = await loadGames();
        const jogo = data.find(g => g.slug === slug);
        if (!jogo) return `<p>Jogo não encontrado.</p>`;
        const isFav = favorites.has(jogo.slug);

        return `
      <article class="card" style="overflow:hidden">
        <img src="${jogo.img}" alt="Capa do jogo ${jogo.nome}" loading="lazy" />
        <button class="fav-ico" id="fav" data-slug="${jogo.slug}" aria-pressed="${String(isFav)}"
                aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          ${pixelHeart(isFav)}
        </button>
        <div class="body">
          <h1 style="margin:0 0 8px">${jogo.nome}</h1>
          <div class="meta" style="margin-bottom:12px">
            <span class="badge">${jogo.studio}</span>
            ${jogo.genero.map(x => `<span class="badge">${x}</span>`).join('')}
            <span class="badge">${jogo.ano}</span>
          </div>
          <p style="margin-bottom:10px">Preço: <strong>${jogo.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></p>
          <div class="actions">
            <a class="btn" href="${jogo.link}" target="_blank" rel="noopener">Comprar/Conhecer</a>
            <a class="btn secondary" href="/" data-link>Voltar</a>
          </div>
        </div>
      </article>
      ${Footer()}
    `;
    },
    async mount(slug) {
        const favBtn = document.getElementById('fav');
        if (!favBtn) return;
        favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            favorites.toggle(slug);
            const active = favorites.has(slug);
            favBtn.setAttribute('aria-pressed', String(active));
            favBtn.setAttribute('aria-label', active ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
            favBtn.innerHTML = pixelHeart(active);
        });
    }
};