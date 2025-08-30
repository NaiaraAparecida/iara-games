export async function loadGames(){
  const url = `games.json?cb=${Date.now()}`; // relativo ao <base>
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error('Formato inválido');
    return data;
  }catch(err){
    console.error('[Iara] loadGames:', err);
    const { gamesBR } = await import('./games.js');
    return gamesBR || [];
  }
}
