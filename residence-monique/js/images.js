// ═══════════════════════════════════════════════════════════
//  images.js — Photos absentes et fond de repli.
//
//  Chargé dans <head>, avant toute image : un écouteur en phase de
//  capture voit passer le chargement de chaque <img> de la page.
//  Une photo qui n'est pas encore déposée dans images/ est masquée,
//  et son conteneur (attribut data-media) reçoit la classe is-empty :
//  le dégradé de repli prend le relais, sans icône d'image cassée.
// ═══════════════════════════════════════════════════════════

(function () {
  'use strict';

  // Repère pour le CSS : certains effets n'ont de sens qu'avec JavaScript.
  document.documentElement.classList.add('js');

  function hote(img) {
    return img.closest ? img.closest('[data-media]') : null;
  }

  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    img.classList.add('is-missing');
    var h = hote(img);
    if (h) h.classList.add('is-empty');
  }, true);

  // Une photo qui finit par se charger (autre vignette choisie, fichier
  // déposé entre-temps) retrouve sa place.
  document.addEventListener('load', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    img.classList.remove('is-missing');
    var h = hote(img);
    if (h) h.classList.remove('is-empty');
  }, true);
})();
