import { saveCustomGame } from './loader.js';

const form = document.getElementById('form');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const genero = (fd.get('genero')||'').split(',').map(s => s.trim()).filter(Boolean);
  const screenshots = String(fd.get('screenshots')||'').split('\n').map(s=>s.trim()).filter(Boolean);
  const game = {
    slug: String(fd.get('slug')).trim(),
    nome: String(fd.get('nome')).trim(),
    studio: String(fd.get('studio')).trim(),
    genero,
    ano: Number(fd.get('ano')),
    preco: Number(fd.get('preco')),
    img: String(fd.get('img')).trim(),
    link: String(fd.get('link')||'').trim(),
    descricao: String(fd.get('descricao')||'').trim(),
    trailer: String(fd.get('trailer')||'').trim(),
    screenshots,
    featured: !!fd.get('featured')
  };
  if(!game.slug || !game.nome){ alert('Preencha slug e nome.'); return; }
  saveCustomGame(game);
  alert('Jogo salvo! Ele aparecerá no catálogo e pode ser editado salvando novamente com o mesmo slug.');
  form.reset();
});
