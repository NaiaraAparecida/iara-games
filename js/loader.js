export async function loadGames() {
  const res = await fetch('games.json?cb=' + Date.now(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao carregar games.json: ' + res.status);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Formato inválido de games.json');
  return data;
}

