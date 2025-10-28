/* Theme persistence and system mode */
(function () {
  const root = document.documentElement;
  const select = document.getElementById('theme-select');

  const stored = localStorage.getItem('theme');
  const initial = stored || 'dark';
  root.setAttribute('data-theme', initial);
  if (select) select.value = initial;

  function applyTheme(value) {
    root.setAttribute('data-theme', value);
    try { localStorage.setItem('theme', value); } catch {}
  }

  if (select) {
    select.addEventListener('change', function (e) {
      applyTheme(e.target.value);
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();


