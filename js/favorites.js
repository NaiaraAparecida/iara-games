const KEY = 'iara:favorites:v1';
function read(){ try{ return new Set(JSON.parse(localStorage.getItem(KEY)) || []); }catch{ return new Set(); } }
function write(set){ localStorage.setItem(KEY, JSON.stringify([...set])); }

export const favorites = {
  has: (slug) => read().has(slug),
  list: () => [...read()],
  add: (slug) => { const s = read(); s.add(slug); write(s); },
  remove: (slug) => { const s = read(); s.delete(slug); write(s); },
  toggle: (slug) => (favorites.has(slug) ? favorites.remove(slug) : favorites.add(slug))
};

