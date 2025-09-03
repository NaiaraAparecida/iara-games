(function(){
  const btn = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const body = document.body;
  const close = () => body.classList.remove('nav-open');
  if(btn) btn.addEventListener('click', ()=> body.classList.toggle('nav-open'));
  if(overlay) overlay.addEventListener('click', close);
  // fecha ao clicar em link
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a'); if(!a) return;
    if(a.closest('.sidebar')) close();
  });
})();
