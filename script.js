function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
}

function initLeadForm() {
  const form = document.getElementById('leadForm');
  const modal = document.getElementById('successModal');
  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const privacyInput = form.querySelector('[name="privacy"]');
    let valid = true;

    [nameInput, emailInput].forEach((input) => {
      input.classList.remove('error');
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      }
    });

    if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.classList.add('error');
      valid = false;
    }

    if (!privacyInput.checked) {
      valid = false;
    }

    if (!valid) return;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    form.reset();
  });

  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', () => {
      modal.hidden = true;
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  });
}

function initReviewsSlider() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dotsContainer = document.getElementById('reviewsDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = [...track.children];
  let currentIndex = 0;
  let visibleCount = 3;

  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - visibleCount);
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = getMaxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `reviews-dot${i === currentIndex ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Vai alla slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const card = cards[0];
    if (!card) return;
    const gap = 20;
    const offset = currentIndex * (card.offsetWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    dotsContainer.querySelectorAll('.reviews-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    updateSlider();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    currentIndex = Math.min(currentIndex, getMaxIndex());
    buildDots();
    updateSlider();
  });

  visibleCount = getVisibleCount();
  buildDots();
  updateSlider();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

initReveal();
initLeadForm();
initReviewsSlider();
