const THEME_KEY = 'mpl-theme-v5';
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

function closeMenuOnDesktop() {
  if (window.innerWidth >= 821) {
    const button = document.getElementById('menu-toggle');
    const drawer = document.getElementById('nav-drawer');
    if (button && drawer) {
      button.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
    }
  }
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function createMailtoLink(subject, lines) {
  const body = encodeURIComponent(lines.join('\n'));
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function renderSuccess(targetId, title, intro, lines, mailtoHref) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const formatted = lines.map(line => `<li>${line}</li>`).join('');
  target.innerHTML = `
    <h3>${title}</h3>
    <p>${intro}</p>
    <ul class="feature-list">${formatted}</ul>
    <div class="utility-row">
      <button type="button" class="btn btn-secondary" id="copy-summary-btn">Copy Summary</button>
      <a class="btn btn-primary" href="${mailtoHref}">Open Email Draft</a>
    </div>
  `;
  target.classList.remove('hidden');
  document.getElementById('copy-summary-btn')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      document.getElementById('copy-summary-btn').textContent = 'Copied';
    } catch {
      document.getElementById('copy-summary-btn').textContent = 'Copy failed';
    }
  });
}

function handleRequestForm(form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = formDataToObject(form);
    const lines = [
      'Marine Parts Locator — Part Request',
      `Part name: ${data.partName || ''}`,
      `Part number: ${data.partNumber || ''}`,
      `Make: ${data.make || ''}`,
      `Model: ${data.model || ''}`,
      `Year: ${data.year || ''}`,
      `Destination: ${data.destination || ''}`,
      `Condition: ${data.condition || ''}`,
      `Urgency: ${data.urgency || ''}`,
      `Budget: ${data.budget || ''}`,
      `Email: ${data.email || ''}`,
      `Phone: ${data.phone || ''}`,
      `Notes: ${data.notes || ''}`
    ];
    const href = createMailtoLink('Marine Parts Locator Part Request', lines);
    renderSuccess('request-success', 'Request summary ready', 'You can copy this request or open a prefilled email draft for manual follow-up while the data pipeline is being expanded.', lines, href);
  });
}

function handleSupplierForm(form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = formDataToObject(form);
    const lines = [
      'Marine Parts Locator — Supplier Intake',
      `Company name: ${data.companyName || ''}`,
      `Contact name: ${data.contactName || ''}`,
      `Email: ${data.email || ''}`,
      `Region: ${data.region || ''}`,
      `Website: ${data.website || ''}`,
      `Categories: ${data.categories || ''}`,
      `Brands: ${data.brands || ''}`,
      `Inventory type: ${data.inventoryType || ''}`,
      `Notes: ${data.notes || ''}`
    ];
    const href = createMailtoLink('Marine Parts Locator Supplier Intake', lines);
    renderSuccess('supplier-success', 'Supplier summary ready', 'You can copy this supplier intake or open a prefilled email draft.', lines, href);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getStoredTheme());
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('menu-toggle')?.addEventListener('click', toggleMenu);
  const requestForm = document.getElementById('request-form');
  const supplierForm = document.getElementById('supplier-form');
  if (requestForm) handleRequestForm(requestForm);
  if (supplierForm) handleSupplierForm(supplierForm);
  window.addEventListener('resize', closeMenuOnDesktop);
});
