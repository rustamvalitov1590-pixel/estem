// SL03: Vanilla JS для инициализации Swiper
const initSL03 = (containerClass) => {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper.js не загружен');
    return;
  }
  
  new Swiper(containerClass, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
window.initSL03 = initSL03;
