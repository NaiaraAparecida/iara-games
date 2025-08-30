import { HomeView } from './views/HomeView.js';
import { NovidadesView } from './views/NovidadesView.js';
import { GameView } from './views/GameView.js';
import { FavoritosView } from './views/FavoritosView.js';

// Vercel: não usamos <base>. Pegamos o pathname "cru".
function spaPath() {
  let p = location.pathname;
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

function navigateTo(path) {
  const next = new URL(path, location.origin);
  history.pushState(null, null, next);
  router();
}

// Intercepta qualquer <a data-link>
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  e.preventDefault();
  navigateTo(a.getAttribute('href'));
});

const routes = [
  { path: /^\/$/, view: HomeView },
  { path: /^\/novidades\/?$/, view: NovidadesView },
  { path: /^\/favoritos\/?$/, view: FavoritosView },
  { path: /^\/jogo\/([^/]+)\/?$/, view: GameView }, // :slug
];

async function router() {
  const root = document.getElementById('app');
  if (!root) return;

  const path = spaPath();
  const match = routes.map(r => ({ r, m: path.match(r.path) })).find(x => x.m);
  const View = match ? match.r.view : HomeView;
  const params = match ? match.m.slice(1) : [];

  try {
    root.innerHTML = await View.render(...params);
    await View.mount(...params);
  } catch (err) {
    console.error('[Iara][Router] erro ao renderizar view:', err);
    root.innerHTML = `
      <div class="container">
        <h2>Ops, algo falhou ao montar a tela.</h2>
        <p class="muted">Abra o Console (F12) para ver o erro detalhado.</p>
      </div>
    `;
  }
}

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);

// Segurança: captura erros silenciosos
window.addEventListener('error', (e) => console.error('[Iara][GlobalError]', e.message, e.error));
window.addEventListener('unhandledrejection', (e) => console.error('[Iara][UnhandledPromise]', e.reason));
