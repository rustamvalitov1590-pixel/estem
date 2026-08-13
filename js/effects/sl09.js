// SL09: Vanilla JS для ховер-галереи
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.sl09-container');
  
  containers.forEach(container => {
    const cards = container.querySelectorAll('.sl09-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => {
          if (c === card) {
            c.classList.add('expanded');
            c.classList.remove('shrunk');
          } else {
            c.classList.add('shrunk');
            c.classList.remove('expanded');
          }
        });
      });
      
      card.addEventListener('mouseleave', () => {
        cards.forEach(c => {
          c.classList.remove('expanded', 'shrunk');
        });
      });
    });
  });
});
