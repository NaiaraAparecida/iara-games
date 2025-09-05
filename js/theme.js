const STORAGE_KEY = 'iara-theme';
const root = document.documentElement;

// escolhe tema inicial: salvo -> preferência do SO -> 'dark'
const saved = localStorage.getItem(STORAGE_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = saved || (prefersDark ? 'dark' : 'light');
applyTheme(initial);

// click em qualquer [data-theme-toggle] alterna o tema
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-theme-toggle]');
  if (!btn) return;
  const current = root.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

function applyTheme(mode) {
  root.setAttribute('data-theme', mode);
  localStorage.setItem(STORAGE_KEY, mode);
  // feedback visual nos toggles
  document.querySelectorAll('[data-theme-toggle]').forEach((el) => {
    el.setAttribute('aria-pressed', String(mode === 'dark'));
    el.title = mode === 'dark' ? 'Tema: escuro' : 'Tema: claro';
  });
}
