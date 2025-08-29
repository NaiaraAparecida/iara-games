export async function loadGames(){
    try{
        const res = await fetch("/games.json", { cache: 'no-store' });
        if(!res.ok) throw new Error('fetch failed');
        return await res.json();
    }catch(e){
        // fallback para o dataset estático
        const { gamesBR } = await import('./games.js')
        return gamesBR;
    }
}