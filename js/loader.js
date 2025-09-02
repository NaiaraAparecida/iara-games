export async function loadGames() {
  const prefix = location.pathname.includes('/pages/') ? '../' : '';
  const url = `${prefix}games.json?cb=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ao carregar ${url}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Formato inválido do games.json');
    return data;
  } catch (err) {
    console.error('[Iara][loadGames]', err);
    return []; // não derruba a tela; apenas retorna vazio
  }
}

