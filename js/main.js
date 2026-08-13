window.formatKzPhone = function(input) {
  const el = (input && input.target) ? input.target : input;
  if (!el || typeof el.value !== 'string') return;
  
  let val = el.value.replace(/\D/g, '');
  
  // Handle paste with country code (+7 or 8) or oversized strings
  if ((val.length === 11 || val.length > 10) && (val.startsWith('7') || val.startsWith('8'))) {
    val = val.slice(1);
  }
  
  if (val.length > 10) val = val.slice(0, 10);

  let formatted = '';
  if (val.length > 0) formatted += '(' + val.slice(0, 3);
  if (val.length > 3) formatted += ') ' + val.slice(3, 6);
  if (val.length > 6) formatted += ' ' + val.slice(6, 8);
  if (val.length > 8) formatted += ' ' + val.slice(8, 10);

  el.value = formatted;
};

// Global event listener for all phone inputs (input, paste, blur)
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el && (el.type === 'tel' || el.name === 'phone' || (el.id && el.id.toLowerCase().includes('phone')))) {
    window.formatKzPhone(el);
  }
}, true);

document.addEventListener('paste', (e) => {
  const el = e.target;
  if (el && (el.type === 'tel' || el.name === 'phone' || (el.id && el.id.toLowerCase().includes('phone')))) {
    setTimeout(() => {
      window.formatKzPhone(el);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, 0);
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {

  /* ===== Header scroll & Floating FABs ===== */
  const header = document.getElementById('header');
  const whatsappFab = document.getElementById('whatsappFab');
  const upFab = document.getElementById('upFab');
  
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 60);
        if (scrollY > window.innerHeight * 0.5) {
          whatsappFab?.classList.add('visible');
          upFab?.classList.add('visible');
        } else {
          whatsappFab?.classList.remove('visible');
          upFab?.classList.remove('visible');
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  upFab?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== Curtain mega menu (desktop) ===== */
  const dropdown   = document.getElementById('services-dropdown');
  const curtain    = document.getElementById('mega-curtain');
  const toggleBtn  = dropdown?.querySelector('.nav-link--btn');
  let curtainTimer = null;

  function openCurtain() {
    clearTimeout(curtainTimer);
    curtain.classList.add('open');
    dropdown.classList.add('open');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('curtain-open');
  }

  function closeCurtain() {
    curtainTimer = setTimeout(() => {
      curtain.classList.remove('open');
      dropdown.classList.remove('open');
      toggleBtn?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('curtain-open');
    }, 200);
  }

  if (dropdown && curtain) {
    dropdown.addEventListener('mouseenter', openCurtain);
    dropdown.addEventListener('mouseleave', closeCurtain);
    curtain.addEventListener('mouseenter', openCurtain);
    curtain.addEventListener('mouseleave', closeCurtain);

    toggleBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      curtain.classList.toggle('open');
      dropdown.classList.toggle('open');
      const expanded = curtain.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', String(expanded));
      document.body.classList.toggle('curtain-open', expanded);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && curtain.classList.contains('open')) {
        curtain.classList.remove('open');
        dropdown.classList.remove('open');
        toggleBtn?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('curtain-open');
      }
    });
  }

  /* ===== Mobile menu ===== */
  const burgerBtn  = document.getElementById('burger-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  burgerBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burgerBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ===== Mobile sub-menu accordion ===== */
  document.querySelectorAll('.mobile-nav__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const isOpen = sub.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });


  /* ========================================= */
  /* APPOINTMENT MODAL                         */
  /* ========================================= */
  const modalOverlay  = document.getElementById('appointmentModal');
  const modalFormView = document.getElementById('modalFormView');
  const modalSuccess  = document.getElementById('modalSuccessView');
  const form          = document.getElementById('appointmentForm');
  const phoneInput    = document.getElementById('formPhone');
  const consentBox    = document.getElementById('formConsent');
  const submitBtn     = document.getElementById('formSubmit');
  const serviceField  = document.getElementById('formService');

  // Open modal - any element with data-modal="appointmentModal"
  document.querySelectorAll('[data-modal="appointmentModal"]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Check for optional service pre-fill
      const service = trigger.dataset.service || '';
      if (serviceField) serviceField.value = service;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Focus phone field after animation
      setTimeout(() => phoneInput?.focus(), 400);
    });
  });

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';

    // Reset after fade-out
    setTimeout(() => {
      form?.reset();
      modalFormView.style.display = '';
      modalSuccess.classList.remove('show');
      submitBtn.disabled = true;
    }, 400);
  }

  // Close on X button
  modalOverlay?.querySelector('.modal-close')?.addEventListener('click', closeModal);
  // Close on overlay click
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  // Close success button
  modalOverlay?.querySelector('.success-close-btn')?.addEventListener('click', closeModal);
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) closeModal();
  });

  /* ---- Phone mask (Kazakhstan format) ---- */
  phoneInput?.addEventListener('input', (e) => {
    window.formatKzPhone(e.target);
    validateForm();
  });

  // Validate: phone >= 10 digits + consent checked
  function validateForm() {
    const digits = phoneInput?.value.replace(/\D/g, '') || '';
    const valid = digits.length === 10 && consentBox?.checked;
    submitBtn.disabled = !valid;
  }

  consentBox?.addEventListener('change', validateForm);

  /* ---- Submit ---- */
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('formName')?.value.trim();
    const phone   = '+7' + (phoneInput?.value.replace(/\D/g, '') || '');
    const service = serviceField?.value || '';

    // TODO: send to backend / Google Sheets / Telegram bot
    console.log('📞 Заявка:', { name, phone, service });

    // Show success
    modalFormView.style.display = 'none';
    modalSuccess.classList.add('show');
  });




  /* ========================================= */
  /* HERO DOCTORS SLIDER                       */
  /* ========================================= */
  const sliderImgs = document.querySelectorAll('#heroDoctorSlider .slider-img');
  const sliderDots = document.querySelectorAll('#heroSliderIndicators .hero-indicator');
  if (sliderImgs.length > 0) {
    let currentIdx = 0;

    function goToSlide(idx) {
      sliderImgs[currentIdx].classList.remove('active');
      if (sliderDots.length > 0) sliderDots[currentIdx].classList.remove('active');
      currentIdx = (idx + sliderImgs.length) % sliderImgs.length;
      sliderImgs[currentIdx].classList.add('active');
      if (sliderDots.length > 0) sliderDots[currentIdx].classList.add('active');
    }

    // Auto-advance
    let heroTimer = setInterval(() => goToSlide(currentIdx + 1), 4000);

    // Dot click handlers
    sliderDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        clearInterval(heroTimer);
        goToSlide(parseInt(dot.dataset.index, 10));
        heroTimer = setInterval(() => goToSlide(currentIdx + 1), 4000);
      });
    });
  }

  /* ========================================= */
  /* INTERACTIVE QUIZ                          */
  /* ========================================= */
  const quizForm = document.getElementById('quizForm');
  if (quizForm) {
    const steps = document.querySelectorAll('.quiz-step');
    const progressBar = document.getElementById('quizProgress');
    const stepText = document.getElementById('quizStepText');
    const backBtn = document.getElementById('quizBackBtn');
    
    let currentStep = 1;
    const totalSteps = 4;

    function updateProgress() {
      const progress = ((currentStep) / totalSteps) * 100;
      if (progressBar) progressBar.style.width = progress + '%';
      if (stepText) stepText.textContent = Math.min(currentStep, totalSteps);
      
      if (backBtn) {
        if (currentStep > 1 && currentStep <= totalSteps) {
          backBtn.style.display = 'flex';
        } else {
          backBtn.style.display = 'none';
        }
      }
    }

    function goToStep(stepNum) {
      if (stepNum === 'success') {
        steps.forEach(step => step.classList.remove('active'));
        const nextStep = document.querySelector(`.quiz-step[data-step="success"]`);
        if (nextStep) nextStep.classList.add('active');
        if (backBtn) backBtn.style.display = 'none';
        const progressContainer = document.querySelector('.quiz-progress');
        if (progressContainer) progressContainer.style.display = 'none';
        return;
      }

      steps.forEach(step => step.classList.remove('active'));
      const nextStep = document.querySelector(`.quiz-step[data-step="${stepNum}"]`);
      if (nextStep) {
        nextStep.classList.add('active');
        currentStep = stepNum;
        updateProgress();
      }
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      });
    }

    // Handle radio changes
    document.querySelectorAll('.quiz-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.name === 'quizCategory') {
          setTimeout(() => goToStep(2), 400);
        } else if (e.target.name === 'quizPriority') {
          setTimeout(() => goToStep(3), 400);
        } else if (e.target.name === 'quizTime') {
          setTimeout(() => goToStep(4), 400);
        }
      });
    });

    // Form submission
    const quizPhone = document.getElementById('quizPhone');
    const quizConsent = document.getElementById('quizConsent');
    const quizSubmit = document.getElementById('quizSubmit');

    function validateQuizForm() {
      const digits = quizPhone?.value.replace(/\D/g, '') || '';
      quizSubmit.disabled = !(digits.length === 10 && quizConsent?.checked);
    }

    quizPhone?.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, ''); // digits only
      if (val.length > 10) val = val.slice(0, 10);

      let formatted = '';
      if (val.length > 0) formatted += '(' + val.slice(0, 3);
      if (val.length >= 3) formatted += ') ' + val.slice(3, 6);
      if (val.length >= 6) formatted += ' ' + val.slice(6, 8);
      if (val.length >= 8) formatted += ' ' + val.slice(8, 10);

      e.target.value = formatted;
      validateQuizForm();
    });

    quizConsent?.addEventListener('change', validateQuizForm);

    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would typically send data to backend or WhatsApp
      goToStep('success');
    });
  }

  /* ========================================= */
  /* FAQ ACCORDION                             */
  /* ========================================= */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answerWrapper = item.querySelector('.faq-answer-wrapper');
    const answer = item.querySelector('.faq-answer');
    
    if(question && answerWrapper && answer) {
      question.addEventListener('click', () => {
        const isExpanded = item.classList.contains('expanded');
        
        // Close all
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('expanded');
          const otherWrapper = otherItem.querySelector('.faq-answer-wrapper');
          if(otherWrapper) otherWrapper.style.maxHeight = null;
        });

        // Open clicked if it wasn't expanded
        if (!isExpanded) {
          item.classList.add('expanded');
          answerWrapper.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });
  /* ========================================= */
  /* SCROLL ANIMATIONS (INTERSECTION OBSERVER) */
  /* ========================================= */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

});

    /* ========================================= */
  /* PRICING ACCORDION                         */
  /* ========================================= */
  document.addEventListener('DOMContentLoaded', () => {
    const pricingItems = document.querySelectorAll('.pricing-accordion-item');
    pricingItems.forEach(item => {
      const header = item.querySelector('.pricing-accordion-header');
      
      if(header) {
        header.addEventListener('click', () => {
          const isExpanded = item.classList.contains('open');
          
          // Close all items
          pricingItems.forEach(i => i.classList.remove('open'));
          
          // Toggle current
          if (!isExpanded) {
            item.classList.add('open');
          }
        });
      }
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.card');
  serviceCards.forEach(card => {
    const player = card.querySelector('lottie-player');
    if (player) {
      card.addEventListener('mouseenter', () => player.play());
      card.addEventListener('mouseleave', () => player.stop());
    }
  });
});



/* ==================== LENIS SMOOTH SCROLL ==================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
});



/* ==================== INTERACTIVE HOVER BUTTONS ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const targetButtons = document.querySelectorAll('.btn, .btn-book');
  
  targetButtons.forEach(btn => {
    // Exclude buttons with complex DOM or specific form behaviors
    if (btn.children.length > 0 || btn.classList.contains('quiz-next-btn') || btn.classList.contains('btn-submit') || btn.classList.contains('contact-submit') || btn.classList.contains('quiz-back-btn') || btn.classList.contains('success-close-btn') || btn.tagName.toLowerCase() === 'input') {
      return; 
    }
    
    const text = btn.textContent.trim();
    if (!text) return;

    btn.textContent = '';
    
    const innerWrapper = document.createElement('span');
    innerWrapper.className = 'ihb-inner';
    
    const textDefault = document.createElement('span');
    textDefault.className = 'ihb-text-default';
    textDefault.textContent = text;
    
    const bgCircle = document.createElement('div');
    bgCircle.className = 'ihb-bg-circle';
    
    innerWrapper.appendChild(textDefault);
    btn.appendChild(innerWrapper);
    btn.appendChild(bgCircle);
    
    btn.classList.add('ihb-initialized');
  });

  /* ========================================= */
  /* REVIEWS CAROUSEL NAVIGATION               */
  /* ========================================= */
  const reviewsGrid = document.querySelector('.reviews-grid');
  const reviewsPrevBtn = document.querySelector('.reviews-showcase .carousel-arrows .prev-btn');
  const reviewsNextBtn = document.querySelector('.reviews-showcase .carousel-arrows .next-btn');
  const reviewsDotsContainer = document.querySelector('.reviews-showcase .carousel-dots');

  if (reviewsGrid && reviewsDotsContainer) {
    const items = reviewsGrid.querySelectorAll('.review-iframe-wrapper');
    
    // Create dots
    items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      dot.addEventListener('click', () => {
        const gap = parseInt(window.getComputedStyle(reviewsGrid).gap || 0);
        const itemWidth = items[0].offsetWidth + gap;
        reviewsGrid.scrollTo({
          left: itemWidth * index,
          behavior: 'smooth'
        });
      });
      reviewsDotsContainer.appendChild(dot);
    });

    const dots = reviewsDotsContainer.querySelectorAll('.carousel-dot');

    const getScrollAmount = () => {
      const gap = parseInt(window.getComputedStyle(reviewsGrid).gap || 0);
      return items[0].offsetWidth + gap;
    };

    if (reviewsPrevBtn) {
      reviewsPrevBtn.addEventListener('click', () => {
        reviewsGrid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });
    }

    if (reviewsNextBtn) {
      reviewsNextBtn.addEventListener('click', () => {
        reviewsGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
    }

    // Update active dot on scroll
    let isReviewsScrolling = false;
    reviewsGrid.addEventListener('scroll', () => {
      if (!isReviewsScrolling) {
        window.requestAnimationFrame(() => {
          const scrollPos = reviewsGrid.scrollLeft;
          const itemWidth = getScrollAmount();
          const activeIndex = Math.round(scrollPos / itemWidth);
          dots.forEach((dot, idx) => {
            if (idx === activeIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
          isReviewsScrolling = false;
        });
        isReviewsScrolling = true;
      }
    }, { passive: true });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // ==================== WORKS GALLERY MODAL ====================
  const galleryImages = [
    // High images
    'img/works/High/aesthetic_case_1.png',
    'img/works/High/aesthetic_case_2.png',
    'img/works/High/aesthetic_case_3.png',
    'img/works/High/aesthetic_case_4.png',
    'img/works/High/aesthetic_case_5.png',
    'img/works/High/ceramic_crown.png',
    'img/works/High/aesthetic_case_7.png',
    'img/works/High/aesthetic_case_8.png',
    'img/works/High/aesthetic_case_9.png',
    'img/works/High/aesthetic_case_10.png',
    'img/works/High/aesthetic_case_11.png',
    // Low images
    'img/works/low/crown_metal_1.png',
    'img/works/low/crown_metal_2.png',
    'img/works/low/crown_metal_3.png',
    'img/works/low/crown_zirconia_1.png',
    'img/works/low/crown_zirconia_2.png',
    'img/works/low/crown_zirconia_3.png',
    'img/works/low/implants_case_1.png',
    'img/works/low/implants_case_2.png',
    'img/works/low/implants_case_3.png',
    'img/works/low/implants_case_4.png',
    'img/works/low/implants_case_5.png',
    'img/works/low/implants_case_6.png'
  ];

  let currentGalleryIndex = 0;
  
  const galleryModal = document.getElementById('galleryModal');
  const btnViewAll = document.getElementById('viewAllWorksBtn');
  const mainImage = document.getElementById('galleryMainImage');
  const currentIndexSpan = document.getElementById('galleryCurrentIndex');
  const totalCountSpan = document.getElementById('galleryTotalCount');
  const btnPrev = document.querySelector('#galleryModal .gallery-nav.prev');
  const btnNext = document.querySelector('#galleryModal .gallery-nav.next');
  const btnClose = document.querySelector('#galleryModal .modal-close');

  if (galleryModal && totalCountSpan) {
    totalCountSpan.textContent = galleryImages.length;

    function openGallery(index = 0) {
      currentGalleryIndex = index;
      updateGalleryImage();
      galleryModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
      galleryModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    function updateGalleryImage() {
      mainImage.src = galleryImages[currentGalleryIndex];
      currentIndexSpan.textContent = currentGalleryIndex + 1;
    }

    function nextImage() {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      updateGalleryImage();
    }

    function prevImage() {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      updateGalleryImage();
    }

    // Event Listeners
    if (btnViewAll) {
      btnViewAll.addEventListener('click', () => openGallery(0));
    }

    // Open on specific card click (if src matches one in the array)
    const workCards = document.querySelectorAll('.work-card img');
    workCards.forEach(img => {
      img.addEventListener('click', () => {
        const src = img.getAttribute('src');
        const idx = galleryImages.findIndex(path => path === src);
        openGallery(idx !== -1 ? idx : 0);
      });
    });

    if (btnNext) btnNext.addEventListener('click', nextImage);
    if (btnPrev) btnPrev.addEventListener('click', prevImage);
    
    if (btnClose) btnClose.addEventListener('click', closeGallery);

    // Close on overlay click
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        closeGallery();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!galleryModal.classList.contains('is-active')) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeGallery();
    });
  }

  // ==================== WORKS HORIZONTAL SLIDER ARROWS ====================
  const worksSliderContainer = document.querySelector('.works-slider-container');
  const sliderPrev = document.querySelector('.works-showcase .carousel-arrows .prev-btn');
  const sliderNext = document.querySelector('.works-showcase .carousel-arrows .next-btn');

  if (worksSliderContainer && sliderNext && sliderPrev) {
    sliderNext.addEventListener('click', () => {
      const scrollAmount = worksSliderContainer.clientWidth * 0.8;
      worksSliderContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    sliderPrev.addEventListener('click', () => {
      const scrollAmount = worksSliderContainer.clientWidth * 0.8;
      worksSliderContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }
});






