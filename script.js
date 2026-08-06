/* ==========================================================================
   ALSTECH - Olagoke Abdulqudus Portfolio Mechanics
   Typing Animation, Hero Slide In/Out, ScrollSpy, Slider & Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
   * 0. DYNAMIC COPYRIGHT YEAR
   * -------------------------------------------------- */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------
   * 1. HERO DYNAMIC TYPING ANIMATION
   * -------------------------------------------------- */
  const typingTextEl = document.getElementById('typingText');
  if (typingTextEl) {
    const roles = [
      'Web3 Product Builder',
      'ALSTECH Founder',
      'Frontend Engineer',
      'Social Media Growth Specialist',
      'Motion Design Creator'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 95;
    const deleteSpeed = 45;
    const delayNext = 2200;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = delayNext;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 350;
      }

      setTimeout(typeEffect, speed);
    }

    typeEffect();
  }

  /* --------------------------------------------------
   * 2. INTERSECTION OBSERVER FOR SLIDE-IN / SLIDE-OUT
   * -------------------------------------------------- */
  const slideElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .fade-in, .fade-in-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      } else {
        // Slide out when scrolling past top/bottom
        if (entry.boundingClientRect.top > 0 || entry.boundingClientRect.bottom < 0) {
          entry.target.classList.remove('appear');
        }
      }
    });
  }, observerOptions);

  slideElements.forEach(el => slideObserver.observe(el));

  // Immediate trigger check for elements in viewport on load
  setTimeout(() => {
    slideElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('appear');
      }
    });
  }, 80);

  /* --------------------------------------------------
   * 3. NAVBAR SCROLLED STYLING & SCROLLSPY
   * -------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function updateNavbar() {
    // Navbar Blur on Scroll
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll To Top Button Visibility
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }

    // Active Nav Link ScrollSpy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  // Scroll to Top Event
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------
   * 4. MOBILE HAMBURGER & DRAWER MECHANICS
   * -------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  function closeMobileDrawer() {
    if (navMenu) navMenu.classList.remove('active');
    if (mobileToggle) mobileToggle.classList.remove('open');
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });

    // Close mobile drawer when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });

    // Close drawer when clicking outside nav
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileDrawer();
      }
    });
  }

  /* --------------------------------------------------
   * 5. ANIMATED STAT COUNTERS
   * -------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let count = 0;
          const increment = Math.max(1, Math.ceil(target / 40));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            stat.innerText = count + (stat.getAttribute('data-target') === '100' ? '%' : '+');
          }, 30);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStatsSection = document.querySelector('.hero-stats');
  if (heroStatsSection) {
    countObserver.observe(heroStatsSection);
  }

  /* --------------------------------------------------
   * 6. FOOTBALL GALLERY SLIDER
   * -------------------------------------------------- */
  const track = document.getElementById('footballSlider');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;

    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });

    // Auto Play Interval (4 Seconds)
    let autoPlay = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }, 4000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      }, 4000);
    });
  }

  /* --------------------------------------------------
   * 7. PROJECT CATEGORY FILTERING
   * -------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('appear'), 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('appear');
        }
      });
    });
  });

  /* --------------------------------------------------
   * 8. MEDIA LIGHTBOX MODAL PREVIEW & ESCAPE KEY
   * -------------------------------------------------- */
  const mediaModal = document.getElementById('mediaModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const viewMediaBtns = document.querySelectorAll('.view-media-btn');

  viewMediaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgPath = btn.getAttribute('data-img');
      const extraImgPath = btn.getAttribute('data-extra');
      const title = btn.getAttribute('data-title');

      modalTitle.innerText = title || 'Project Preview';
      modalContent.innerHTML = `<img src="${imgPath}" alt="${title}">`;

      if (extraImgPath) {
        modalContent.innerHTML += `<h4 style="margin:1rem 0 0.5rem 0; color:var(--primary);">FCFS Whitelist Victory Spot Proof</h4><img src="${extraImgPath}" alt="Proof screenshot">`;
      }

      mediaModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (mediaModal) {
      mediaModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mediaModal?.classList.contains('active')) {
      closeModal();
    }
  });

});

/* Form Handler */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const formStatus = document.getElementById('formStatus');

  const mailtoLink = `mailto:Olagokeabdulqudus5@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nContact Email: ' + email)}`;
  window.location.href = mailtoLink;

  formStatus.innerText = 'Redirecting to your email client... Thank you!';
  formStatus.className = 'form-status success';
}
