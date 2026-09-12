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

  if (reduceMotion || !hasGsap) return;

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
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
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
})();
