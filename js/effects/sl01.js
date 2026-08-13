// SL01: Vanilla JS для аккордеона
const initSL01 = (containerId, data) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  container.classList.add('sl01-stage');

  data.forEach((item, index) => {
    const option = document.createElement('div');
    option.className = 'sl01-option';
    if (index === 0) option.classList.add('active'); // первый активный

    option.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="sl01-content">
        <h3 class="sl01-title">${item.title}</h3>
        <p class="sl01-desc">${item.description}</p>
      </div>
    `;

    option.addEventListener('click', () => {
      container.querySelectorAll('.sl01-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });

    container.appendChild(option);
  });
};
window.initSL01 = initSL01;
