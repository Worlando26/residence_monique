// ═══════════════════════════════════════════════════════════
//  photo-carousel.js — Photos défilantes des cartes de la mosaïque
//  « La résidence » sur la page d'accueil.
//
//  - Une photo toutes les 2 s, de la gauche vers la droite, en boucle : à
//    chaque pas, la dernière photo passe devant, hors champ à gauche, puis
//    la bande glisse d'un cran. Aucun clone, aucun retour visible au début.
//  - Pause au survol, au focus clavier, hors de l'écran et quand l'onglet
//    est caché. Rien ne bouge si le visiteur a demandé de réduire les
//    animations : la première photo reste affichée.
//  - La carte reste un simple lien : un clic mène à la page « La résidence ».
// ═══════════════════════════════════════════════════════════

function initPhotoCarousels() {
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-ccar]').forEach(car => cardCarousel(car, reduit));
}

function cardCarousel(car, reduit) {
  const track = car.querySelector('[data-ccar-track]');
  const carte = car.closest('.card') || car;
  if (!track || track.children.length < 2) return;

  const DELAI = 2000;   // entre deux photos
  const DUREE = 700;    // durée d'un glissement

  let occupe   = false;
  let minuteur = null;
  const pauses = new Set();   // raisons de pause en cours

  function placer(x, anime) {
    track.style.transition = anime ? 'transform ' + DUREE + 'ms cubic-bezier(.45, 0, .2, 1)' : 'none';
    track.style.transform  = 'translate3d(' + x + 'px, 0, 0)';
  }

  /** Les photos glissent vers la droite : la précédente entre par la gauche. */
  function pas() {
    if (occupe || reduit.matches) return;
    occupe = true;
    const w = car.clientWidth;
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    placer(-w, false);
    track.getBoundingClientRect();   // applique la position de départ
    placer(0, true);

    let fait = false;
    const fin = () => {
      if (fait) return;
      fait = true;
      track.removeEventListener('transitionend', fin);
      occupe = false;
    };
    track.addEventListener('transitionend', fin);
    setTimeout(fin, DUREE + 100);
  }

  function relancer() {
    clearInterval(minuteur);
    minuteur = null;
    if (reduit.matches || pauses.size) return;
    minuteur = setInterval(pas, DELAI);
  }
  const pause   = raison => { pauses.add(raison);    relancer(); };
  const reprise = raison => { pauses.delete(raison); relancer(); };

  carte.addEventListener('mouseenter', () => pause('survol'));
  carte.addEventListener('mouseleave', () => reprise('survol'));
  carte.addEventListener('focus', () => pause('focus'));
  carte.addEventListener('blur',  () => reprise('focus'));

  // Les photos restent en chargement différé jusqu'à l'approche de la
  // carte ; elles sont alors toutes chargées, pour qu'aucune n'entre vide
  // dans le champ pendant le défilement.
  pause('horsChamp');
  if ('IntersectionObserver' in window) {
    let charge = false;
    new IntersectionObserver(entrees => {
      entrees.forEach(en => {
        if (en.isIntersecting && !charge) {
          charge = true;
          track.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
        }
        if (en.intersectionRatio > 0.25) reprise('horsChamp');
        else pause('horsChamp');
      });
    }, { rootMargin: '300px 0px', threshold: [0, 0.25, 0.5] }).observe(car);
  } else {
    reprise('horsChamp');
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause('onglet'); else reprise('onglet');
  });

  if (reduit.addEventListener) reduit.addEventListener('change', relancer);
}
