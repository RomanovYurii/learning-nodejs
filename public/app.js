document.querySelectorAll('.price').forEach((node) => {
  node.textContent = new Intl.NumberFormat('pl-PL', {
    currency: 'pln',
    style: 'currency',
  }).format(+node.textContent);
});
