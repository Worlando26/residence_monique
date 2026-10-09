// ═══════════════════════════════════════════════════════════
//  main.js — Point d'entrée : coordonnées + Lenis + modules
// ═══════════════════════════════════════════════════════════

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  // ─── Helper scroll fluide (utilisé partout) ───────────────
  // Hauteur reelle de la barre, lue dans le CSS : un nombre ecrit en dur
  // finirait par mentir.
  function hauteurBarre() {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
    return parseInt(v, 10) || 88;
  }

  function smoothScrollTo(target) {
    if (!target) return;
    const decalage = hauteurBarre() + 8;
    if (lenis) {
      lenis.scrollTo(target, { offset: -decalage, duration: 1.4 });
    } else {
      const haut = target.getBoundingClientRect().top + window.scrollY - decalage;
      window.scrollTo({ top: haut, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }

  // Si GSAP n a pas pu se charger, le CSS prend le relais
  // pour les quelques animations indispensables.
  if (typeof gsap === 'undefined') {
    document.documentElement.classList.add('no-gsap');
  }

  // ─── 1. Coordonnées et boutons « Réserver » (js/config.js) ─
  if (typeof initContact === 'function') initContact();

  // ─── 2. data-section → id (ancres) ───────────────────────
  document.querySelectorAll('[data-section]').forEach(section => {
    if (!section.id) section.id = section.dataset.section;
  });

  // Les icônes sont écrites en SVG dans les pages : aucun script à lancer.

  // ─── 3. Smooth scroll Lenis ──────────────────────────────
  if (!reducedMotion && typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connecter Lenis → ScrollTrigger
    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    // Expose pour les modules qui doivent suspendre le defilement
    // (la visionneuse de photos, par exemple).
    window.__lenis = lenis;

    // Piloter Lenis via GSAP ticker (pas de RAF séparé)
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ─── 3 bis. Défilement doux vers les ancres de la page ────
  // « #contact », mais aussi « page.html#ancre » quand on est déjà sur
  // cette page : un lien écrit ainsi fonctionne depuis toutes les pages.
  // Sans Lenis, le navigateur fait le défilement doux, sauf si le visiteur
  // a demandé de réduire les animations.
  const cheminPage = p => p.replace(/index\.html$/, '');
  document.querySelectorAll('a[href*="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const url = new URL(a.getAttribute('href'), window.location.href);
      if (url.origin !== window.location.origin
          || cheminPage(url.pathname) !== cheminPage(window.location.pathname)) return;
      const target = url.hash.length > 1 && document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
      }
    });
  });

  // ─── 4. Animations GSAP ──────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initAnimations();
  }

  // ─── 5. Carousel ─────────────────────────────────────────
  initCarousel();

  // ─── 6. FAQ accordéon ────────────────────────────────────
  initFaq();

  // ─── 7. Hébergements : vignettes ─────────────────────────
  if (typeof initRooms === 'function') initRooms();

  // ─── 7 bis. Visionneuse de photos (hébergements, galeries) ─
  if (typeof initLightbox === 'function') initLightbox();

  // ─── 7 ter. Photos défilantes de la mosaïque ─────────────
  if (typeof initPhotoCarousels === 'function') initPhotoCarousels();

  // ─── 8. Burger menu mobile ───────────────────────────────
  (function initBurger() {
    const burger = document.querySelector('[data-burger]');
    const drawer = document.querySelector('[data-drawer]');
    const nav    = document.querySelector('.nav');
    if (!burger || !drawer) return;

    function fermer() {
      drawer.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    }

    burger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      if (isOpen && nav) nav.classList.add('is-solid');
    });

    // Echap referme le menu et redonne le focus au bouton : sans cela,
    // un utilisateur au clavier reste piege dans le tiroir.
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        fermer();
        burger.focus();
      }
    });

    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', fermer));
  })();

})();
