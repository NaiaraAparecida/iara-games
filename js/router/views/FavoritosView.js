import {
    loadGames
} from '../../data/loader.js';
import {
    favorites
} from '../../favorites.js';

export const FavoritosView = {
    async render() {
        return `
      <section class="hero">
        <h1>Seus favoritos</h1>
        <p>Jogos que você marcou com o coração.</p>
      </section>
      <section>
        <div class="grid" data-grid></div>
      </section>
    `;
    },
    async mount() {
        const data = await loadGames();
        const favs = new Set(favorites.list());
        const list = data.filter(g => favs.has(g.slug));
        const grid = document.querySelector('[data-grid]');
        grid.innerHTML = list.length ? list.map(g => `
      <article class="card">
        <a href="/jogo/${g.slug}" data-link>
          <img src="${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
        </a>
        <div class="body">
          <h3>${g.nome}</h3>
          <div class="meta">
            <span class="badge">${g.studio}</span>
            ${g.genero.map(x => `<span class="badge">${x}</span>`).join('')}
            <span class="badge">${g.ano}</span>
          </div>
          <div class="actions">
            <a class="btn" href="${g.link}" target="_blank" rel="noopener">Comprar</a>
            <a class="btn secondary" href="/jogo/${g.slug}" data-link>Ver detalhes</a>
          </div>
        </div>
      </article>
    `).join('') : `<p>Nenhum favorito ainda.</p>`;
    }
};