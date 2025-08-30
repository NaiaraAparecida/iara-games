export async function loadGames(){
  const url = `games.json?cb=${Date.now()}`; 
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status} ao abrir ${url}`);
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error('Formato inválido');
    return data;
  }catch(err){
    console.error('[Iara] loadGames:', err);
    return [];
  }
}

