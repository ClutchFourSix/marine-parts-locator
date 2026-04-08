const THEME_KEY = 'mpl-theme-v4';
const THEMES = {
  dark: { value: 'harbor-night', label: 'Harbor Night' },
  light: { value: 'chart-room', label: 'Chart Room' }
};

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || THEMES.dark.value;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const themeName = document.getElementById('theme-toggle-name');
  if (themeName) {
    themeName.textContent = theme === THEMES.dark.value ? THEMES.dark.label : THEMES.light.label;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || THEMES.dark.value;
  const next = current === THEMES.dark.value ? THEMES.light.value : THEMES.dark.value;
  applyTheme(next);
}

function toggleMenu() {
  const button = document.getElementById('menu-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!button || !drawer) return;
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  drawer.classList.toggle('open', !isOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getStoredTheme());
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('menu-toggle')?.addEventListener('click', toggleMenu);
});
