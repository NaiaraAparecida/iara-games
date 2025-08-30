import { HomeView } from './views/HomeView.js';
import { NovidadesView } from './views/NovidadesView.js';
import { GameView } from './views/GameView.js';
import { FavoritosView } from './views/FavoritosView.js';

const BASE = document.querySelector('base')?.getAttribute('href') || '/';

function spaPath(){
  const b = new URL(BASE, location.origin);
  let p = location.pathname.slice(b.pathname.length - 1);
  if(!p.startsWith('/')) p = '/'+p;
  return p;
}
function navigateTo(path){
  const next = new URL(path, new URL(BASE, location.origin));
  history.pushState(null, null, next);
  router();
}
document.addEventListener('click', e=>{
  const a = e.target.closest('a[data-link]');
  if(!a) return;
  e.preventDefault();
  navigateTo(a.getAttribute('href'));
});
const routes = [
  { path:/^\/$/, view:HomeView },
  { path:/^\/novidades\/?$/, view:NovidadesView },
  { path:/^\/favoritos\/?$/, view:FavoritosView },
  { path:/^\/jogo\/([^/]+)\/?$/, view:GameView },
];
async function router(){
  const root = document.getElementById('app');
  const p = spaPath();
  const m = routes.map(r=>({r,m:p.match(r.path)})).find(x=>x.m);
  const View = m? m.r.view : HomeView;
  const params = m? m.m.slice(1):[];
  root.innerHTML = await View.render(...params);
  await View.mount(...params);
}
window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);
