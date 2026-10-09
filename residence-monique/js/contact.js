// ═══════════════════════════════════════════════════════════
//  contact.js — Coordonnées, boutons « Réserver » et demande de
//  réservation, à partir du bloc CONTACT de js/config.js.
//
//  Rien n'est inventé : une coordonnée vide retire du site tout ce qui
//  en dépend. Tant qu'aucun moyen de contact n'est renseigné, les
//  boutons « Réserver » gardent leur lien vers la section contact, et
//  le formulaire reste désactivé avec un message qui l'explique.
//
//  Le site est statique (aucun serveur) : le formulaire ne transmet
//  rien lui-même, il prépare la demande dans la messagerie du visiteur
//  ou dans WhatsApp.
// ═══════════════════════════════════════════════════════════

const NOM_ETABLISSEMENT = 'Résidence Monique';

/* Icônes des réseaux sociaux (tracés Lucide). */
const SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" '
  + 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
const ICONES_RESEAUX = {
  facebook:    '<svg ' + SVG_ATTRS + '><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  instagram:   '<svg ' + SVG_ATTRS + '><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
  tripadvisor: '<svg ' + SVG_ATTRS + '><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>',
};
const NOMS_RESEAUX = { facebook: 'Facebook', instagram: 'Instagram', tripadvisor: 'Tripadvisor' };

function initContact() {
  const C   = (typeof CONTACT !== 'undefined' && CONTACT) || {};
  const val = v => (v == null ? '' : String(v).trim());

  const telephone = val(C.telephone);
  const whatsapp  = val(C.whatsapp);
  const email     = val(C.email);
  const enLigne   = val(C.reservation);
  const gps       = C.gps || {};
  const lat       = val(gps.latitude);
  const lng       = val(gps.longitude);
  const waNum     = whatsapp.replace(/\D/g, '');

  const textes = {
    telephone,
    whatsapp,
    email,
    gps: lat && lng ? lat + ', ' + lng : '',
  };
  const liens = {
    telephone: telephone ? 'tel:' + telephone.replace(/[^\d+]/g, '') : '',
    whatsapp:  waNum ? 'https://wa.me/' + waNum : '',
    email:     email ? 'mailto:' + email : '',
    gps:       lat && lng
      ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(lat + ',' + lng)
      : '',
  };
  const externes = { whatsapp: true, gps: true };

  // ── 1. Lignes de coordonnées : affichées si renseignées, retirées
  //       sinon (retirées, pas masquées : les filets entre les lignes
  //       restent justes).
  document.querySelectorAll('[data-contact-row]').forEach(row => {
    if (textes[row.getAttribute('data-contact-row')]) row.hidden = false;
    else row.remove();
  });

  document.querySelectorAll('[data-contact]').forEach(node => {
    const cle = node.getAttribute('data-contact');
    if (!textes[cle]) return;   // le texte de repli écrit dans le HTML reste
    node.textContent = textes[cle];
    if (node.tagName === 'A') {
      node.href = liens[cle];
      if (externes[cle]) {
        node.target = '_blank';
        node.rel    = 'noopener noreferrer';
      }
    }
    node.hidden = false;
  });

  // ── 2. Boutons « Réserver » ─────────────────────────────────
  // Sans lien de réservation ni WhatsApp, on garde le lien du HTML :
  // la section contact de la page, ou celle de la page Accès.
  document.querySelectorAll('[data-reserver]').forEach(a => {
    let cible = '';
    if (enLigne) {
      cible = enLigne;
    } else if (waNum) {
      const sejour = a.getAttribute('data-room');
      const texte = 'Bonjour, je souhaite réserver un séjour à la ' + NOM_ETABLISSEMENT
        + (sejour ? ' (' + sejour + ')' : '') + '.';
      cible = liens.whatsapp + '?text=' + encodeURIComponent(texte);
    }
    if (!cible) return;
    a.href   = cible;
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
  });

  // Un bouton « Réserver cet hébergement » qui mène au formulaire de la
  // page y présélectionne l'hébergement.
  document.querySelectorAll('[data-room]').forEach(a => {
    a.addEventListener('click', () => {
      const choix = document.querySelector('[data-booking-room]');
      if (choix && a.getAttribute('href').charAt(0) === '#') choix.value = a.getAttribute('data-room');
    });
  });

  // ── 3. Réseaux sociaux ──────────────────────────────────────
  const r = C.reseaux || {};
  const reseaux = Object.keys(NOMS_RESEAUX)
    .filter(cle => val(r[cle]))
    .map(cle => ({ cle, label: NOMS_RESEAUX[cle], href: val(r[cle]) }));

  const bloc  = document.querySelector('[data-social-block]');
  const liste = document.querySelector('[data-social-list]');
  if (bloc && liste) {
    if (!reseaux.length) {
      bloc.remove();
    } else {
      reseaux.forEach(s => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = s.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = s.label;
        li.appendChild(a);
        liste.appendChild(li);
      });
      bloc.hidden = false;
    }
  }

  const boutons = document.querySelector('[data-social-buttons]');
  if (boutons) {
    reseaux.forEach(s => {
      const a = document.createElement('a');
      a.className = 'btn btn--pill btn--outline acces__fb';
      a.href = s.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = ICONES_RESEAUX[s.cle];
      const span = document.createElement('span');
      span.textContent = s.label;
      a.appendChild(span);
      boutons.appendChild(a);
    });
  }

  const carte = document.querySelector('[data-maps-link]');
  if (carte) {
    if (liens.gps) {
      carte.href = liens.gps;
      carte.hidden = false;
    } else {
      carte.remove();
    }
  }

  // ── 4. Appel et WhatsApp en bas d'écran (mobile) ────────────
  renderJoindre(liens);

  // ── 5. Formulaire de demande ────────────────────────────────
  initBookingForm({ email, waNum });
}

/**
 * WhatsApp et appel direct, sur téléphone uniquement (voir le CSS).
 * Sans numéro renseigné, le bloc reste masqué plutôt que d'offrir un
 * lien mort.
 */
function renderJoindre(liens) {
  const bloc = document.querySelector('[data-joindre]');
  if (!bloc) return;

  const boutons = [];
  if (liens.whatsapp) {
    boutons.push({
      href: liens.whatsapp, cls: 'joindre__btn--wa', label: 'WhatsApp', externe: true,
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
         + '<path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15'
         + '-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47'
         + '-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52'
         + '.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22'
         + '-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48'
         + ' 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63'
         + '.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4'
         + '-.07-.13-.27-.2-.57-.35z"/>'
         + '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95'
         + 'L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91'
         + 'C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18'
         + '-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23'
         + 'a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23z"/></svg>',
    });
  }
  if (liens.telephone) {
    boutons.push({
      href: liens.telephone, cls: 'joindre__btn--tel', label: 'Téléphone', externe: false,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
         + ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         + '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07'
         + ' 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3'
         + 'a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91'
         + 'a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7'
         + 'A2 2 0 0 1 22 16.92z"/></svg>',
    });
  }
  if (!boutons.length) return;

  boutons.forEach(b => {
    const a = document.createElement('a');
    a.className = 'joindre__btn ' + b.cls;
    a.href = b.href;
    a.setAttribute('aria-label', b.label);
    a.title = b.label;
    if (b.externe) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.innerHTML = b.svg;
    bloc.appendChild(a);
  });
  bloc.hidden = false;
}

// ─── Demande de réservation ────────────────────────────────
function initBookingForm(moyens) {
  const form = document.querySelector('[data-booking-form]');
  if (!form) return;

  const notice  = document.querySelector('[data-booking-notice]');
  const envoyer = form.querySelector('[type="submit"]');
  const note    = form.querySelector('[data-booking-note]');
  const avis    = form.querySelector('[data-booking-alert]');
  const succes  = document.querySelector('[data-booking-success]');
  const titreOk = document.querySelector('[data-booking-success-title]');
  const texteOk = document.querySelector('[data-booking-success-text]');
  const autre   = document.querySelector('[data-booking-reset]');

  const champ = nom => form.querySelector('[name="' + nom + '"]');
  const iPrenom = champ('prenom');
  const iNom    = champ('nom');
  const iMail   = champ('email');
  const iTel    = champ('telephone');
  const iIn     = champ('arrivee');
  const iOut    = champ('depart');
  const sHeb    = champ('hebergement');
  const sVoy    = champ('voyageurs');
  const iMsg    = champ('message');

  // Dates : rien avant aujourd'hui (date locale, pas UTC).
  const pad = n => String(n).padStart(2, '0');
  const d   = new Date();
  const auj = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  iIn.min  = auj;
  iOut.min = auj;
  iIn.addEventListener('change', () => {
    if (!iIn.value) return;
    iOut.min = iIn.value;
    if (iOut.value && iOut.value <= iIn.value) iOut.value = '';
  });

  // Aucun moyen de contact : le formulaire reste visible, mais désactivé.
  if (!moyens.email && !moyens.waNum) {
    if (notice) notice.hidden = false;
    envoyer.disabled = true;
    return;
  }
  if (notice) notice.remove();

  const parMail = Boolean(moyens.email);
  note.textContent = parMail
    ? 'Le bouton ouvre votre messagerie avec la demande déjà rédigée : il ne reste qu\'à l\'envoyer.'
    : 'Le bouton ouvre WhatsApp avec la demande déjà rédigée : il ne reste qu\'à l\'envoyer.';

  /** Affiche ou efface l'erreur propre à un champ. */
  function marquer(input, message) {
    const bloc = input.closest('.booking__field');
    const err  = bloc && bloc.querySelector('.booking__field-error');
    if (!err) return;
    bloc.classList.toggle('has-error', Boolean(message));
    err.textContent = message || '';
    err.hidden = !message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  const tous = [iPrenom, iNom, iMail, iTel, iIn, iOut, sHeb, sVoy, iMsg];
  tous.forEach(i => i.addEventListener('input', () => marquer(i, '')));

  function verifier() {
    const erreurs = [];
    if (!iPrenom.value.trim()) erreurs.push([iPrenom, 'Ce champ est obligatoire.']);
    if (!iNom.value.trim())    erreurs.push([iNom,    'Ce champ est obligatoire.']);
    const mail = iMail.value.trim();
    if (!mail) erreurs.push([iMail, 'Ce champ est obligatoire.']);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
      erreurs.push([iMail, 'Cette adresse e-mail ne semble pas valide.']);
    }
    if (iIn.value && iIn.value < auj)   erreurs.push([iIn,  'Cette date est déjà passée.']);
    if (iOut.value && iOut.value < auj) erreurs.push([iOut, 'Cette date est déjà passée.']);
    else if (iIn.value && iOut.value && iOut.value <= iIn.value) {
      erreurs.push([iOut, 'Le départ doit être après l\'arrivée.']);
    }
    return erreurs;
  }

  const enClair = iso => iso.split('-').reverse().join('/');

  function rediger() {
    const dates = iIn.value && iOut.value
      ? 'du ' + enClair(iIn.value) + ' au ' + enClair(iOut.value)
      : iIn.value ? 'arrivée le ' + enClair(iIn.value)
      : 'à définir';
    const lignes = [
      'Bonjour,',
      '',
      'Je souhaite réserver un séjour à la ' + NOM_ETABLISSEMENT + '.',
      '',
      'Nom : ' + iPrenom.value.trim() + ' ' + iNom.value.trim(),
      'E-mail : ' + iMail.value.trim(),
    ];
    if (iTel.value.trim()) lignes.push('Téléphone : ' + iTel.value.trim());
    lignes.push('Dates : ' + dates);
    lignes.push('Hébergement : ' + (sHeb.value || 'à conseiller'));
    lignes.push('Voyageurs : ' + sVoy.value);
    if (iMsg.value.trim()) lignes.push('', iMsg.value.trim());
    lignes.push('', 'Merci d\'avance,', iPrenom.value.trim());
    return lignes.join('\n');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    tous.forEach(i => marquer(i, ''));
    avis.hidden = true;

    const erreurs = verifier();
    if (erreurs.length) {
      erreurs.forEach(([input, msg]) => marquer(input, msg));
      avis.textContent = 'Merci de compléter les champs obligatoires.';
      avis.hidden = false;
      erreurs[0][0].focus();
      return;
    }

    const corps = rediger();
    if (parMail) {
      const sujet = 'Demande de réservation — ' + NOM_ETABLISSEMENT;
      window.location.href = 'mailto:' + moyens.email
        + '?subject=' + encodeURIComponent(sujet)
        + '&body=' + encodeURIComponent(corps);
    } else {
      window.open('https://wa.me/' + moyens.waNum + '?text=' + encodeURIComponent(corps),
        '_blank', 'noopener');
    }

    texteOk.textContent = parMail
      ? 'Votre messagerie vient de s\'ouvrir avec la demande rédigée : il ne vous reste qu\'à l\'envoyer. Nous vous répondons avec les disponibilités et le tarif.'
      : 'WhatsApp vient de s\'ouvrir avec la demande rédigée : il ne vous reste qu\'à l\'envoyer. Nous vous répondons avec les disponibilités et le tarif.';
    form.hidden = true;
    succes.classList.add('is-visible');
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(succes, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });
    }
    // Le focus suit l'information, pour les lecteurs d'écran.
    titreOk.focus();
  });

  autre.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    succes.classList.remove('is-visible');
    iPrenom.focus();
  });
}
