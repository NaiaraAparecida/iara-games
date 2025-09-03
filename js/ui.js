import { favorites } from './favorites.js';

export const currency = v =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// estamos em /pages/?
const IN_PAGES   = location.pathname.includes('/pages/');
const IMG_PREFIX = IN_PAGES ? '../' : '';
const GAME_HREF  = IN_PAGES ? 'game.html' : 'pages/game.html';

function webpPath(p) {
  // tenta trocar png/jpg por webp
  return p.replace(/\.(png|jpe?g)$/i, '.webp');
}

export function heart(on = true) {
  return on
    ? `<svg class="heart" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
         <path d="M12 21s-6.7-4.35-9.33-7.62C-0.09 10.77 1.53 6 5.6 6 7.7 6 9.2 7.2 12 9.5 14.8 7.2 16.3 6 18.4 6c4.07 0 5.7 4.77 2.93 7.38C18.7 16.65 12 21 12 21z" fill="#E53935"/>
       </svg>`
    : `<svg class="heart" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
         <path d="M12 21s-6.7-4.35-9.33-7.62C-0.09 10.77 1.53 6 5.6 6 7.7 6 9.2 7.2 12 9.5 14.8 7.2 16.3 6 18.4 6c4.07 0 5.7 4.77 2.93 7.38C18.7 16.65 12 21 12 21z" fill="none" stroke="#111"/>
       </svg>`;
}

export function card(g) {
  const isFav = favorites.has(g.slug);
  const src    = `${IMG_PREFIX}${g.img}`;
  const srcWeb = `${IMG_PREFIX}${webpPath(g.img)}`;

  return `
  <article class="card" tabindex="0" aria-labelledby="${g.slug}-title">
    <a href="${GAME_HREF}?slug=${encodeURIComponent(g.slug)}" aria-label="Ver ${g.nome}">
      <picture>
        <source srcset="${srcWeb}" type="image/webp">
        <img src="${src}" alt="Capa do jogo ${g.nome}" loading="lazy" width="600" height="338" />
      </picture>
    </a>
    <button class="fav-ico" data-slug="${g.slug}" aria-pressed="${String(isFav)}"
            aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
            title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
      ${heart(isFav)}
    </button>
    <div class="body">
      <h3 id="${g.slug}-title">${g.nome}</h3>
      <div class="meta">
        <span class="badge">${g.studio}</span>
        ${(g.genero || []).map(x => `<span class="badge">${x}</span>`).join('')}
        <span class="badge">${g.ano}</span>
      </div>
      <div class="actions">
        <span class="price">${currency(g.preco)}</span>
        <a class="btn" href="${g.link}" target="_blank" rel="noopener">Comprar</a>
      </div>
    </div>
  </article>`;
}

