(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  document.body.classList.add('page-enter');

  /* Header : état au scroll + menu mobile */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    const toTop = document.querySelector('.to-top');
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const toTop = document.querySelector('.to-top');
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* Lien de navigation actif selon la section visible */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* Grille projets : afficher les projets supplémentaires */
  const moreBtn = document.getElementById('projects-more');
  if (moreBtn) {
    const extras = document.querySelectorAll('.card--extra');
    if (!extras.length) moreBtn.parentElement.remove();
    moreBtn.addEventListener('click', () => {
      const expanded = moreBtn.getAttribute('aria-expanded') === 'true';
      extras.forEach((c) => c.classList.toggle('is-collapsed', expanded));
      moreBtn.setAttribute('aria-expanded', String(!expanded));
      moreBtn.firstChild.textContent = expanded ? 'Voir plus de projets ' : 'Voir moins ';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }


  /* Visionneuse à étapes (PapsFret) */
  document.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const tabs = [...stepper.querySelectorAll('[role="tab"]')];
    const panels = [...stepper.querySelectorAll('[role="tabpanel"]')];
    const select = (i) => {
      tabs.forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
      panels.forEach((p, j) => { p.hidden = i !== j; p.classList.toggle('is-active', i === j); });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { select((i + 1) % tabs.length); tabs[(i + 1) % tabs.length].focus(); }
        if (e.key === 'ArrowLeft') { select((i - 1 + tabs.length) % tabs.length); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
      });
    });
  });

  /* Visionneuse plein écran sur les visuels des études de cas */
  const zoomables = document.querySelectorAll('.case .figure img, .case .pf-stepper__panel img, .case .compare__img img, .case .screens img');
  if (zoomables.length) {
    const box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Visuel agrandi');
    box.innerHTML = '<button class="lightbox__close" type="button" aria-label="Fermer">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    const img = box.querySelector('img'); const cap = box.querySelector('figcaption');
    const close = () => { box.classList.remove('is-open'); document.body.style.overflow = ''; };
    zoomables.forEach((el) => {
      el.classList.add('zoomable');
      el.addEventListener('click', () => {
        img.src = el.currentSrc || el.src; img.alt = el.alt;
        const fc = el.closest('figure')?.querySelector('figcaption');
        cap.textContent = fc ? fc.textContent : el.alt;
        box.classList.add('is-open'); document.body.style.overflow = 'hidden';
      });
    });
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.lightbox__close')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  if (reduceMotion || !hasGsap) return;

  /* Page protégée : les animations démarrent après déverrouillage */
  if (document.body.classList.contains('is-locked')) {
    window.addEventListener('case:unlocked', initMotion, { once: true });
  } else {
    initMotion();
  }

  function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* Hero : entrée du titre mot par mot, puis photo et texte */
  const heroWords = document.querySelectorAll('.hero__word, .hero__serif');
  if (heroWords.length) {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(heroWords, { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.09 }, 0.15)
      .from('.hero__photo', { y: 40, opacity: 0, scale: 0.96, duration: 1.1 }, 0.6)
      .from('.hero__intro, .hero__cta', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.8)
      .from('.site-header', { y: -20, opacity: 0, duration: 0.8 }, 0.4);
  }

  /* Hero d'étude de cas */
  if (document.querySelector('.case__hero-card')) {
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.case__meta > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.1)
      .from('.case__hero-card', { y: 40, opacity: 0, duration: 1.1 }, 0.35)
      .from('.case__hero-device, .case__hero-card > img.full', { y: 40, opacity: 0, duration: 1.2 }, 0.6);
  }

  /* Révélation au scroll */
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 36, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* Groupes (grilles) : décalage entre enfants */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
  });

  /* Titres de section : lettrage qui remonte */
  document.querySelectorAll('.section-title, .philosophy__title').forEach((title) => {
    gsap.from(title, {
      yPercent: 40, opacity: 0, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: title, start: 'top 88%', once: true },
    });
  });

  /* Parallaxe discrète sur les visuels */
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 40;
    gsap.fromTo(el, { y: amount }, {
      y: -amount, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* Nom en pied de page */
  const footerName = document.querySelector('.site-footer__name');
  if (footerName) {
    gsap.from(footerName, {
      yPercent: 60, opacity: 0, duration: 1.4, ease: 'power4.out',
      scrollTrigger: { trigger: footerName, start: 'top 95%', once: true },
    });
  }
  }
})();
