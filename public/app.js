document.querySelectorAll('.price').forEach((node) => {
  node.textContent = new Intl.NumberFormat('pl-PL', {
    currency: 'pln',
    style: 'currency',
  }).format(+node.textContent);
});
document.querySelectorAll('.date').forEach((node) => {
  node.textContent = new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(node.textContent));
});

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('/cart/' + id, {
        method: 'DELETE',
      }).then(() => window.location.reload());
    }
  });
}

M.Tabs.init(document.querySelectorAll('.tabs'));
