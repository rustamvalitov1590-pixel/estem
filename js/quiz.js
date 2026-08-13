document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('quizModal');
  const modalCloseBtns = modalOverlay?.querySelectorAll('.modal-close, .success-close-btn');
  const quizTriggers = document.querySelectorAll('[data-modal="quizModal"]');

  if (!modalOverlay) return;

  const steps = modalOverlay.querySelectorAll('.quiz-step');
  const nextBtns = modalOverlay.querySelectorAll('.quiz-next-btn');
  const backBtn = document.getElementById('quizBackBtn');
  const progressBar = document.getElementById('quizProgressBar');
  const currentStepSpan = document.getElementById('quizCurrentStep');
  const form = document.getElementById('quizForm');
  const quizBodyView = document.getElementById('quizBodyView');
  const quizSuccessView = document.getElementById('quizSuccessView');
  const submitBtn = document.getElementById('quizSubmitBtn');

  let currentStep = 1;
  const totalSteps = steps.length;

  // Open modal
  quizTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      resetQuiz();
    });
  });

  // Close modal
  function closeQuizModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtns?.forEach(btn => btn.addEventListener('click', closeQuizModal));
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeQuizModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeQuizModal();
    }
  });

  // View update
  function updateView() {
    steps.forEach((stepEl, index) => {
      if (index + 1 === currentStep) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    });

    if (currentStep > 1 && currentStep <= totalSteps) {
      backBtn.style.display = 'flex';
    } else {
      backBtn.style.display = 'none';
    }

    currentStepSpan.textContent = currentStep;
    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
    
    validateStep();
  }

  // Next/Back buttons
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateView();
      }
    });
  });

  backBtn?.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateView();
    }
  });

  // Validation
  function validateStep() {
    if (currentStep === 1) {
      const selected = form.querySelector('input[name="quiz_concern"]:checked');
      const nextBtn = form.querySelector('.quiz-step[data-step="1"] .quiz-next-btn');
      if (nextBtn) nextBtn.disabled = !selected;
    } else if (currentStep === 2) {
      const selected = form.querySelector('input[name="quiz_timeline"]:checked');
      const nextBtn = form.querySelector('.quiz-step[data-step="2"] .quiz-next-btn');
      if (nextBtn) nextBtn.disabled = !selected;
    } else if (currentStep === 3) {
      checkFormValidity();
    }
  }

  // Auto-next on option click
  let autoAdvanceTimer = null;
  const quizOptions = form.querySelectorAll('.quiz-option');
  
  quizOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      // Find radio and force check
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
      
      validateStep();
      
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = setTimeout(() => {
        if (currentStep < totalSteps) {
          currentStep++;
          updateView();
        }
      }, 350);
    });
  });

  // Final Form Validation
  const nameInput = document.getElementById('quizName');
  const phoneInput = document.getElementById('quizPhone');
  const consentBox = document.getElementById('quizConsent');

  function checkFormValidity() {
    const isNameOk = nameInput ? nameInput.value.trim().length > 1 : false;
    const isPhoneOk = phoneInput ? phoneInput.value.replace(/\D/g, '').length >= 10 : false;
    const isConsentOk = consentBox ? consentBox.checked : false;
    
    if (submitBtn) {
      submitBtn.disabled = !(isNameOk && isPhoneOk && isConsentOk);
    }
  }

  nameInput?.addEventListener('input', checkFormValidity);
  phoneInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    e.target.value = val;
    checkFormValidity();
  });
  consentBox?.addEventListener('change', checkFormValidity);

  // Submit Form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;
    
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    // Simulate API request
    setTimeout(() => {
      quizBodyView.style.display = 'none';
      quizSuccessView.classList.add('show');
    }, 1200);
  });

  function resetQuiz() {
    currentStep = 1;
    form.reset();
    quizBodyView.style.display = 'block';
    quizSuccessView.classList.remove('show');
    submitBtn.textContent = 'Получить расчет';
    updateView();
  }
});
