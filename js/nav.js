// js/nav.js
(function(){
  const btn     = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const sidebar = document.querySelector('.sidebar');
  const closeBtn= document.querySelector('[data-menu-close]'); // NEW
  const body    = document.body;

  function setAria(open){
    if(btn) btn.setAttribute('aria-expanded', String(open));
    if(sidebar) sidebar.setAttribute('aria-hidden', String(!open));
  }
  function open(){  body.classList.add('nav-open');  setAria(true); }
  function close(){ body.classList.remove('nav-open'); setAria(false); }
  function toggle(){ body.classList.contains('nav-open') ? close() : open(); }

  if(btn)      btn.addEventListener('click', toggle);
  if(overlay)  overlay.addEventListener('click', close);
  if(closeBtn) closeBtn.addEventListener('click', close); // NEW

  document.addEventListener('click', (e)=>{ if(e.target.closest('.sidebar a')) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });

  setAria(false);
})();
