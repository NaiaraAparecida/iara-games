import { loadGames } from './loader.js';
import { favorites } from './favorites.js';
import { currency, heart } from './ui.js';

function getSlug(){ return new URLSearchParams(location.search).get('slug'); }

function ytEmbed(urlOrId){
  // aceita ID ou URL do YouTube
  const m = String(urlOrId).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  const id = m ? m[1] : urlOrId;
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}"
    title="YouTube player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}

function carousel(images, prefix){
  if(!images?.length) return '';
  const slides = images.map(src => `<img src="${prefix}${src}" alt="" loading="lazy">`).join('');
  return `
  <div class="carousel" data-carousel>
    <div class="carousel-track" data-track>${slides}</div>
    <button class="ctrl prev" data-prev aria-label="Anterior">‹</button>
    <button class="ctrl next" data-next aria-label="Próximo">›</button>
  </div>`;
}
function mountCarousel(root){
  const el = root.querySelector('[data-carousel]'); if(!el) return;
  const track = el.querySelector('[data-track]');
  const slides = [...track.children];
  let i = 0;
  const go = (n)=>{ i = (n+slides.length)%slides.length; track.style.transform = `translateX(-${i*100}%)`; };
  el.querySelector('[data-prev]').addEventListener('click', ()=> go(i-1));
  el.querySelector('[data-next]').addEventListener('click', ()=> go(i+1));
}

async function bootstrap(){
  const slug = getSlug();
  const el = document.getElementById('game');
  if(!slug){ el.innerHTML = '<p>Jogo não encontrado.</p>'; return; }

  const data = await loadGames();
  const g = data.find(x => x.slug === slug);
  if(!g){ el.innerHTML = '<p>Jogo não encontrado.</p>'; return; }

  const isFav = favorites.has(g.slug);
  const IN_PAGES = location.pathname.includes('/pages/');
  const IMG_PREFIX = IN_PAGES ? '../' : '';

  el.innerHTML = `
    <article class="card" style="overflow:hidden">
      <img src="${IMG_PREFIX}${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
      <button class="fav-ico" id="fav" data-slug="${g.slug}" aria-pressed="${String(isFav)}">${heart(isFav)}</button>
      <div class="body">
        <h1>${g.nome}</h1>
        <p class="muted" style="margin:.5rem 0 1rem">${g.studio} • ${g.ano} • ${(g.genero||[]).join(', ')}</p>
        ${g.descricao ? `<p style="margin-bottom:12px">${g.descricao}</p>` : ''}
        <p style="margin-bottom:10px">Preço: <strong>${currency(g.preco)}</strong></p>
        <div class="actions" style="gap:8px; display:flex; flex-wrap:wrap">
          <a class="btn" href="${g.link}" target="_blank" rel="noopener">Comprar/Conhecer</a>
          <a class="btn secondary" href="../index.html">Voltar</a>
        </div>
        ${g.trailer ? `<div class="media" style="margin-top:16px">${ytEmbed(g.trailer)}</div>` : ''}
        ${carousel(g.screenshots, IMG_PREFIX)}
      </div>
    </article>
  `;

  // fav
  const favBtn = document.getElementById('fav');
  favBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    favorites.toggle(g.slug);
    const active = favorites.has(g.slug);
    favBtn.innerHTML = heart(active);
    favBtn.setAttribute('aria-pressed', String(active));
    favBtn.classList.add('animated');
    setTimeout(()=>favBtn.classList.remove('animated'), 250);
  });

  // carrossel
  mountCarousel(el);
}
bootstrap();
