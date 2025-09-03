const KEY = 'iara:theme';
function apply(t){ document.documentElement.setAttribute('data-theme', t); }
export function currentTheme(){ return localStorage.getItem(KEY) || 'dark'; }
export function setTheme(t){ localStorage.setItem(KEY, t); apply(t); }
export function toggleTheme(){ setTheme(currentTheme()==='dark' ? 'light' : 'dark'); }

(function init(){
  apply(currentTheme());
  const btn = document.querySelector('[data-theme-toggle]');
  if(btn) btn.addEventListener('click', toggleTheme);
})();
