// js/page-game.js (sem carrossel de screenshots)
import { loadGames } from './loader.js';
import { favorites } from './favorites.js';
import { currency, heart } from './ui.js';

function getSlug() {
  return new URLSearchParams(location.search).get('slug');
}

function ytEmbed(urlOrId) {
  // aceita ID ou URL do YouTube
  const m = String(urlOrId).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  const id = m ? m[1] : urlOrId;
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}"
    title="YouTube player" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>`;
}

async function bootstrap() {
  const slug = getSlug();
  const el = document.getElementById('game');
  if (!slug) { el.innerHTML = '<p>Jogo não encontrado.</p>'; return; }

  const data = await loadGames();
  const g = data.find(x => x.slug === slug);
  if (!g) { el.innerHTML = '<p>Jogo não encontrado.</p>'; return; }

  const isFav = favorites.has(g.slug);
  const IN_PAGES = location.pathname.includes('/pages/');
  const IMG_PREFIX = IN_PAGES ? '../' : '';

  el.innerHTML = `
    <article class="card" style="overflow:hidden">
      <img src="${IMG_PREFIX}${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
      <button class="fav-ico" id="fav" data-slug="${g.slug}" aria-pressed="${String(isFav)}">${heart(isFav)}</button>
      <div class="body">
        <h1>${g.nome}</h1>
        <p class="muted" style="margin:.5rem 0 1rem">${g.studio} • ${g.ano} • ${(g.genero || []).join(', ')}</p>
        ${g.descricao ? `<p style="margin-bottom:12px">${g.descricao}</p>` : ''}
        <p style="margin-bottom:10px">Preço: <strong>${currency(g.preco)}</strong></p>
        <div class="actions" style="gap:8px; display:flex; flex-wrap:wrap">
          <a class="btn" href="${g.link}" target="_blank" rel="noopener">Comprar/Conhecer</a>
          <a class="btn secondary" href="../index.html">Voltar</a>
        </div>
        ${g.trailer ? `<div class="media" style="margin-top:16px">${ytEmbed(g.trailer)}</div>` : ''}
      </div>
    </article>
  `;

  // toggle favorito
  const favBtn = document.getElementById('fav');
  favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    favorites.toggle(g.slug);
    const active = favorites.has(g.slug);
    favBtn.innerHTML = heart(active);
    favBtn.setAttribute('aria-pressed', String(active));
    favBtn.classList.add('animated');
    setTimeout(() => favBtn.classList.remove('animated'), 250);
  });
}
bootstrap();
