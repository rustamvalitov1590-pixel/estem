// SL04: Vanilla JS для прямоугольного слайдера
const initSL04 = (containerId, data) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  container.classList.add('sl04-stage');

  data.forEach((item, index) => {
    const option = document.createElement('div');
    option.className = 'sl04-option';
    if (index === 0) option.classList.add('active'); // первый активный
    
    option.style.backgroundImage = `url('${item.image}')`;

    option.innerHTML = `
      <div class="sl04-content">
        <h3 class="sl04-title">${item.title}</h3>
        <p class="sl04-desc">${item.description}</p>
      </div>
    `;

    option.addEventListener('click', () => {
      container.querySelectorAll('.sl04-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });

    container.appendChild(option);
  });
};
window.initSL04 = initSL04;
