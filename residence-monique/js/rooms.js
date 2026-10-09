// ═══════════════════════════════════════════════════════════
//  rooms.js — Page « Nos hébergements » : bande de vignettes.
//
//  Grande photo à gauche avec sa bande de vignettes, panneau de détails
//  à droite. Une vignette change la grande photo sans quitter la page,
//  et la visionneuse s'ouvre ensuite sur la photo choisie.
// ═══════════════════════════════════════════════════════════

function initRooms() {
  document.querySelectorAll('[data-room-gallery]').forEach(gallery => {
    const main   = gallery.querySelector('.room__main');
    const opener = main && main.querySelector('[data-lb-open]');
    const pic    = main && main.querySelector('img');
    const thumbs = Array.from(gallery.querySelectorAll('.room__thumb'));
    if (!opener || !pic) return;

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        const img = thumb.querySelector('img');
        if (!img || img.classList.contains('is-missing')) return;

        pic.src = img.currentSrc || img.src;
        pic.alt = img.alt;
        thumbs.forEach(t => t.classList.toggle('is-active', t === thumb));
        opener.setAttribute('data-lb-index', String(i));
      });
    });
  });
}
