const LOCAL_KEY = 'iara:customGames:v1';

export async function loadGames() {
  const prefix = location.pathname.includes('/pages/') ? '../' : '';
  const url = `${prefix}games.json?cb=${Date.now()}`;

  const base = await fetch(url, { cache: 'no-store' })
    .then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
    .catch(e => { console.error('[Iara][loadGames] base', e); return []; });

  const custom = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  // mescla: custom sobrepõe base pelo slug
  const map = new Map(base.map(g => [g.slug, g]));
  for (const g of custom) map.set(g.slug, g);
  return [...map.values()];
}

export function saveCustomGame(game){
  const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  const filtered = list.filter(g => g.slug !== game.slug);
  filtered.push(game);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
}

