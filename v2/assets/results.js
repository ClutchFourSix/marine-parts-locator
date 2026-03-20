function confidenceClass(value) {
  switch ((value || '').toLowerCase()) {
    case 'high': return 'confidence-high';
    case 'medium': return 'confidence-medium';
    case 'low': return 'confidence-low';
    default: return 'confidence-unknown';
  }
}

function renderSummary(result) {
  const summary = document.getElementById('result-summary');
  if (!summary) return;

  const notes = (result.summary.notes || []).map(note => `<li>${note}</li>`).join('');
  summary.innerHTML = `
    <div class="summary-top-row">
      <div>
        <span class="eyebrow">Request ${result.request_id}</span>
        <h1>${result.summary.canonical_part_name}</h1>
        <p>Canonical part number: <strong>${result.summary.canonical_part_number || 'Unknown'}</strong></p>
      </div>
      <div class="summary-badge ${confidenceClass(result.summary.fit_confidence_overall)}">
        Overall confidence: ${result.summary.fit_confidence_overall}
      </div>
    </div>
    <ul class="feature-list">${notes}</ul>
  `;
}

function renderResults(result) {
  const container = document.getElementById('result-cards');
  if (!container) return;

  container.innerHTML = result.results.map(item => `
    <article class="panel listing-card result-card ${item.rank === 1 ? 'best-match' : ''}">
      <div class="result-card-header">
        <div>
          <span class="eyebrow">Rank #${item.rank}</span>
          <h3>${item.title}</h3>
        </div>
        <span class="summary-badge ${confidenceClass(item.fit_confidence)}">${item.fit_confidence} confidence</span>
      </div>
      <p>${item.reason}</p>
      <div class="meta-row">
        <span class="meta-pill">Part #: ${item.part_number || 'N/A'}</span>
        <span class="meta-pill">Supplier: ${item.supplier}</span>
        <span class="meta-pill">Condition: ${item.condition || 'Unknown'}</span>
      </div>
      <div class="meta-row">
        <span class="meta-pill">Price: ${item.price || 'Unknown'}</span>
        <span class="meta-pill">Location: ${item.location || 'Unknown'}</span>
      </div>
      <div class="listing-footer">
        <strong>${item.rank === 1 ? 'Best match' : 'Candidate result'}</strong>
        <a class="btn btn-secondary" href="${item.url}" target="_blank" rel="noopener noreferrer">Open Source</a>
      </div>
    </article>
  `).join('');
}

function renderAlternatives(result) {
  const list = document.getElementById('alternatives-list');
  if (!list) return;

  if (!result.alternatives || !result.alternatives.length) {
    list.innerHTML = '<p>No alternatives were returned for this request.</p>';
    return;
  }

  list.innerHTML = `<ul class="feature-list">${result.alternatives.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function renderDisclaimer(result) {
  const box = document.getElementById('result-disclaimer');
  if (!box) return;
  box.innerHTML = `<p>${result.disclaimer}</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderSummary(sampleResult);
  renderResults(sampleResult);
  renderAlternatives(sampleResult);
  renderDisclaimer(sampleResult);
});
