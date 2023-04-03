document.querySelectorAll('.price').forEach((node) => {
  node.textContent = new Intl.NumberFormat('pl-PL', {
    currency: 'pln',
    style: 'currency',
  }).format(+node.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('/cart/' + id, {
        method: 'DELETE',
      }).then(() => {
        window.location.reload();
      });
    }
  });
}
