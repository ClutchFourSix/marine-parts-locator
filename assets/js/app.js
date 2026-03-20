document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', event => {
      if (form.id === 'search-form') return;
      event.preventDefault();
      window.alert('This form is still in scaffold mode. Next step: connect it to storage, email capture, and payment or intake workflows.');
    });
  });
});
