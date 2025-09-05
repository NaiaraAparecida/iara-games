const KEY = 'iara:favorites:v1';
const KEY_COUNT = 'iara:favcount:v1';

function readSet(){
  try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []); }
  catch { return new Set(); }
}
function writeSet(s){ localStorage.setItem(KEY, JSON.stringify([...s])); }

function readCount(){
  try { return JSON.parse(localStorage.getItem(KEY_COUNT)) || {}; }
  catch { return {}; }
}
function writeCount(o){ localStorage.setItem(KEY_COUNT, JSON.stringify(o)); }

export const favorites = {
  has: (slug) => readSet().has(slug),
  list: () => [...readSet()],
  add(slug){
    const s = readSet(); if (s.has(slug)) return;
    s.add(slug); writeSet(s);
    const c = readCount(); c[slug] = (c[slug] || 0) + 1; writeCount(c);
  },
  remove(slug){
    const s = readSet(); if (!s.has(slug)) return;
    s.delete(slug); writeSet(s);
    const c = readCount(); c[slug] = Math.max(0, (c[slug] || 0) - 1); writeCount(c);
  },
  toggle(slug){ this.has(slug) ? this.remove(slug) : this.add(slug); },
  count(slug){ return readCount()[slug] || 0; },
  // ordena uma lista de jogos pela popularidade (mais favoritados)
  rankByPopularity(list){
    const c = readCount();
    return [...list].sort((a,b) => (c[b.slug]||0) - (c[a.slug]||0));
  }
};

