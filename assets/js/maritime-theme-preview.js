const THEME_KEY = 'mpl-theme-preview';
const themes = {
  dark: { value: 'harbor-night', label: 'Harbor Night' },
  light: { value: 'chart-room', label: 'Chart Room' }
};

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || themes.dark.value;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const name = document.getElementById('theme-name');
  if (name) {
    name.textContent = theme === themes.dark.value ? themes.dark.label : themes.light.label;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || themes.dark.value;
  const next = current === themes.dark.value ? themes.light.value : themes.dark.value;
  applyTheme(next);
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getStoredTheme());
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
});
