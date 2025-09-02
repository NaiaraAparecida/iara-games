import { loadGames } from '../../data/loader.js';
import { Footer } from './Footer.js';


export const NovidadesView = {
  async render(){
    return `
      <section class="hero">
        <span class="tag">Destaque</span>
        <h1>A Lenda do Herói — humor musical em plataforma</h1>
        <p>Uma aventura brasileira com trilha que canta suas ações em tempo real.</p>
        <div class="controls">
          <a class="btn" href="https://alendadoheroi.com.br" target="_blank" rel="noopener">Conhecer</a>
          <a class="btn secondary" href="." data-link>Voltar ao catálogo</a>
        </div>
      </section>
      <section aria-labelledby="outras">
        <h2 id="outras">Outras novidades</h2>
        <div class="grid" data-grid></div>
      </section>
      ${Footer()}
    `;
  },
  async mount(){
    const data = await loadGames();
    const outros = data.filter(g => g.featured || g.ano >= 2021);
    const grid = document.querySelector('[data-grid]');
    grid.innerHTML = outros.map(g => `
      <article class="card" tabindex="0" aria-labelledby="${g.slug}-title">
        <a href="jogo/${g.slug}" data-link>
          <img src="${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
        </a>
        <div class="body">
          <h3 id="${g.slug}-title">${g.nome}</h3>
          <div class="meta">
            <span class="badge">${g.studio}</span>
            ${g.genero.map(x => `<span class="badge">${x}</span>`).join('')}
            <span class="badge">${g.ano}</span>
          </div>
          <div class="actions">
            <a class="btn" href="${g.link}" target="_blank" rel="noopener">Conhecer</a>
          </div>
        </div>
      </article>
    `).join('');
  }
};
