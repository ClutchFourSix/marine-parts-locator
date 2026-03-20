function renderListings(items) {
  const grid = document.getElementById('results-grid');
  const count = document.getElementById('results-count');

  if (!grid || !count) return;

  count.textContent = `${items.length} listing${items.length === 1 ? '' : 's'} found`;

  if (!items.length) {
    grid.innerHTML = `
      <article class="panel listing-card">
        <h3>No matches found</h3>
        <p>Try broadening the search or escalate to a sourcing request so the part can be researched manually.</p>
        <div class="listing-footer">
          <span class="meta-pill">No current inventory match</span>
          <a class="btn btn-primary" href="request.html">Request Sourcing</a>
        </div>
      </article>
    `;
    return;
  }

  grid.innerHTML = items.map(item => `
    <article class="panel listing-card">
      <span class="eyebrow">${item.brand} · ${item.partNumber}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="meta-row">
        <span class="meta-pill">${item.category}</span>
        <span class="meta-pill">${item.condition}</span>
        <span class="meta-pill">${item.location}</span>
      </div>
      <div class="meta-row">
        <span class="meta-pill">${item.confidence}</span>
        <span class="meta-pill">Supplier: ${item.supplier}</span>
      </div>
      <div class="listing-footer">
        <strong>${item.price}</strong>
        <a class="btn btn-secondary" href="request.html">Verify Fit / Source Alternatives</a>
      </div>
    </article>
  `).join('');
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function filterListings(event) {
  event.preventDefault();

  const query = normalize(document.getElementById('search-query')?.value);
  const category = normalize(document.getElementById('search-category')?.value);
  const condition = normalize(document.getElementById('search-condition')?.value);
  const location = normalize(document.getElementById('search-location')?.value);

  const filtered = sampleListings.filter(item => {
    const searchable = normalize([
      item.title,
      item.partNumber,
      item.brand,
      item.category,
      item.description,
      item.location,
      item.supplier
    ].join(' '));

    const matchesQuery = !query || searchable.includes(query);
    const matchesCategory = !category || normalize(item.category) === category;
    const matchesCondition = !condition || normalize(item.condition) === condition;
    const matchesLocation = !location || normalize(item.location).includes(location);

    return matchesQuery && matchesCategory && matchesCondition && matchesLocation;
  });

  renderListings(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  renderListings(sampleListings);
  document.getElementById('search-form')?.addEventListener('submit', filterListings);
});
