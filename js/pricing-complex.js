document.addEventListener('DOMContentLoaded', () => {
  /* ================= CALCULATOR LOGIC ================= */
  const calcButtons = document.querySelectorAll('.calc-btn');
  const calcSlider = document.getElementById('calc-range');
  const calcTotalEl = document.getElementById('calc-total');

  let basePrice = 15000;
  let multiplier = 1;

  function updateCalcTotal() {
    const total = basePrice * multiplier;
    // Format with spaces
    calcTotalEl.textContent = total.toLocaleString('ru-RU');
  }

  // Handle problem selection
  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      calcButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      // Update base price
      basePrice = parseInt(btn.dataset.price, 10);
      updateCalcTotal();
    });
  });

  // Handle severity/quantity slider
  if (calcSlider) {
    calcSlider.addEventListener('input', (e) => {
      multiplier = parseInt(e.target.value, 10);
      updateCalcTotal();
    });
  }

  /* ================= TABS LOGIC ================= */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Add active to clicked button
      btn.classList.add('active');

      // Add active to target pane
      const targetId = 'tab-' + btn.dataset.tab;
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

});
