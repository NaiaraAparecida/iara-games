import { loadGames } from './loader.js';
import { favorites } from './favorites.js';
import { currency, heart } from './ui.js';

function getSlug(){
  const p = new URLSearchParams(location.search).get('slug');
  return p ? decodeURIComponent(p) : null;
}

async function bootstrap(){
  const slug = getSlug();
  const el = document.getElementById('game');
  if(!slug){ el.innerHTML = '<p>Jogo não encontrado.</p>'; return; }

  const data = await loadGames();
  const g = data.find(x => x.slug === slug);
  if(!g){ el.innerHTML = '<p>Jogo não encontrado.</p>'; return; }

  const isFav = favorites.has(g.slug);
  el.innerHTML = `
    <article class="card" style="overflow:hidden">
      <img src="${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
      <button class="fav-ico" id="fav" data-slug="${g.slug}" aria-pressed="${String(isFav)}">${heart(isFav)}</button>
      <div class="body">
        <h1>${g.nome}</h1>
        <div class="meta" style="margin-bottom:12px">
          <span class="badge">${g.studio}</span>
          ${(g.genero || []).map(x => `<span class="badge">${x}</span>`).join('')}
          <span class="badge">${g.ano}</span>
        </div>
        <p style="margin-bottom:10px">Preço: <strong>${currency(g.preco)}</strong></p>
        <div class="actions">
          <a class="btn" href="${g.link}" target="_blank" rel="noopener">Comprar/Conhecer</a>
          <a class="btn secondary" href="../index.html">Voltar</a>
        </div>
      </div>
    </article>
  `;

  document.getElementById('fav').addEventListener('click', (e)=>{
    e.preventDefault();
    favorites.toggle(g.slug);
    const active = favorites.has(g.slug);
    e.currentTarget.innerHTML = heart(active);
    e.currentTarget.setAttribute('aria-pressed', String(active));
  });
}
bootstrap();
