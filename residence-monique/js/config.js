// ═══════════════════════════════════════════════════════════
//  COORDONNÉES DE LA RÉSIDENCE — à compléter
//
//  C'est le seul endroit à modifier : téléphone, WhatsApp, e-mail,
//  réseaux sociaux et GPS sont lus ici par js/contact.js et reportés
//  partout sur le site (barre d'appel mobile, pied de page, page Accès,
//  encart de réservation).
//
//  Règle : un champ laissé vide ('') masque tout ce qui en dépend.
//  Rien n'est affiché à la place, aucun lien mort.
//
//  Boutons « Réserver », par ordre de priorité :
//    1. reservation rempli → lien de réservation en ligne ;
//    2. sinon whatsapp rempli → conversation WhatsApp pré-remplie ;
//    3. sinon → section contact du site (formulaire).
//
//  Formulaire de demande : il ouvre la messagerie du visiteur si email
//  est rempli, sinon WhatsApp. Sans l'un ni l'autre, il reste désactivé
//  et un message l'explique.
// ═══════════════════════════════════════════════════════════

const CONTACT = {

  // Téléphone, tel qu'il doit s'afficher.        Ex. : '+261 34 00 000 00'
  telephone: '',

  // WhatsApp, avec l'indicatif du pays.          Ex. : '+261 34 00 000 00'
  whatsapp: '',

  // Adresse e-mail qui reçoit les demandes.      Ex. : 'contact@exemple.com'
  email: '',

  // Lien de réservation en ligne (facultatif).   Ex. : 'https://www.booking.com/hotel/…'
  reservation: '',

  // Coordonnées GPS, en degrés décimaux.         Ex. : latitude: '-17.0000', longitude: '49.8000'
  gps: {
    latitude: '',
    longitude: '',
  },

  // Réseaux sociaux : adresse complète de chaque page.
  reseaux: {
    facebook: '',
    instagram: '',
    tripadvisor: '',
  },

};
