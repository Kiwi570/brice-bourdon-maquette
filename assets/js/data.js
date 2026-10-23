/* Données de la maquette : un seul fichier à mettre à jour.
   Sources : site osteopatheoullins.com, Doctolib, acceslibre, lemedecin.fr (relevés du 23/10/2026).
   Tout ce qui est marqué afaire: true reste à confirmer avec Brice Bourdon. */

export const PRATICIEN = {
  nom: 'Brice Bourdon',
  titre: 'Ostéopathe D.O.',
  telephone: '06 86 70 59 26',
  telephoneCabinet: '04 87 37 65 64',
  avisGoogle: '5/5 · plus de 250 avis Google (chiffre du site, à vérifier)',
  patients: '20 000',
  email: 'brice.bourdon@hotmail.fr',
  doctolib: 'https://www.doctolib.fr/osteopathe/oullins-pierre-benite/brice-bourdon',
  adeli: '697056570',
  siren: '515105856'
};

/* Jours : 0 = dimanche … 6 = samedi. Horaires au format "HH:MM". */
export const HORAIRES_SITE = {
  1: [['08:00', '20:00']],
  2: [['08:00', '20:00']],
  3: [['08:00', '20:00']],
  4: [['08:00', '20:00']],
  5: [['08:00', '20:00']],
  6: [['14:00', '19:00']]
};

export const CABINETS = [
  {
    id: 'oullins',
    nom: 'Oullins–Pierre-Bénite',
    adresse: '2 boulevard du Général-de-Gaulle',
    ville: '69600 Oullins-Pierre-Bénite',
    acces: 'Métro B : Gare d’Oullins ou Oullins Centre · bus 63, arrêt Merlus',
    accessibilite: 'Premier étage avec ascenseur · interphone « ostéopathe kiné » · stationnement à proximité',
    itineraire: 'https://www.google.com/maps/search/?api=1&query=2+boulevard+du+G%C3%A9n%C3%A9ral+de+Gaulle+69600+Oullins-Pierre-B%C3%A9nite',
    horairesSource: 'Horaires de la page Contact du site, à préciser par cabinet',
    horaires: HORAIRES_SITE
  },
  {
    id: 'lyon6',
    nom: 'Lyon 6 · Brotteaux',
    adresse: '19 rue Godefroy',
    ville: '69006 Lyon',
    acces: 'Près de la gare des Brotteaux et de la Part-Dieu',
    accessibilite: 'Accessibilité à compléter',
    itineraire: 'https://www.google.com/maps/search/?api=1&query=19+rue+Godefroy+69006+Lyon',
    horairesSource: 'Horaires de la page Contact du site, à préciser par cabinet',
    horaires: HORAIRES_SITE
  }
];

export const TARIFS = [
  { id: 'osteo', libelle: 'Séance d’ostéopathie', detail: '45 à 60 min · adultes', prix: 70 },
  { id: 'ra-1', libelle: 'Réflexes archaïques · première séance', detail: '45 min · enfants et adultes', prix: 90 },
  { id: 'ra-2', libelle: 'Réflexes archaïques · suivi', detail: '45 min · enfants et adultes', prix: 65 },
  { id: 'bilan', libelle: 'Bilan postural et réflexes archaïques', detail: 'Enfant ou adulte', prix: 100 },
  { id: 'nutri-1', libelle: 'Micronutrition · consultation initiale', detail: '1 h · adultes', prix: 80 },
  { id: 'nutri-2', libelle: 'Micronutrition · suivi', detail: '30 min', prix: 60 }
];

export const ARTICLES = [
  { titre: 'Mal de tête à Oullins : quand consulter un ostéopathe ?', cat: 'tete', catLabel: 'Tête', lecture: 10, date: '22 octobre 2026',
    url: 'https://www.osteopatheoullins.com/post/mal-de-t%C3%AAte-%C3%A0-oullins-quand-consulter-un-ost%C3%A9opathe', image: 'journal-mal-de-tete.webp', ph: 'tete' },
  { titre: 'Migraine et mal de tête : quel apport de l’ostéopathie à Oullins-Pierre-Bénite ?', cat: 'tete', catLabel: 'Tête', lecture: 7, date: '13 octobre 2026',
    url: 'https://www.osteopatheoullins.com/post/migraine-et-mal-de-t%C3%AAte-quel-apport-de-l-ost%C3%A9opathie-%C3%A0-oullins-pierre-b%C3%A9nite', image: 'journal-migraine.webp', ph: 'tete' },
  { titre: 'Réflexes archaïques chez l’enfant : faut-il consulter, et qu’est-ce que ça change ?', cat: 'enfant', catLabel: 'Enfant', lecture: 14, date: '11 août 2026',
    url: 'https://www.osteopatheoullins.com/post/r%C3%A9flexes-archa%C3%AFques-chez-l-enfant-faut-il-consulter-et-qu-est-ce-que-%C3%A7a-change', image: 'journal-reflexes-enfant.webp', ph: 'enfant' },
  { titre: 'Entorse ou tendinite : qui consulter à Oullins et Lyon 6 ?', cat: 'sport', catLabel: 'Sport', lecture: 18, date: '25 août 2026',
    url: 'https://www.osteopatheoullins.com/post/entorse-ou-tendinite-qui-consulter-%C3%A0-oullins-et-lyon-6', image: 'journal-entorse.webp', ph: 'sport' },
  { titre: 'Vertiges et troubles de l’équilibre : quand consulter un ostéopathe à Oullins et Lyon 6 ?', cat: 'equilibre', catLabel: 'Équilibre', lecture: 13, date: '18 août 2026',
    url: 'journal/vertiges-troubles-equilibre.html', interne: true, image: 'article-vertiges.webp', ph: 'vertiges' },
  { titre: 'RGO bébé : ostéopathe à Oullins & Lyon 6', cat: 'nourrisson', catLabel: 'Nourrisson', lecture: 10, date: '30 juin 2026',
    url: 'https://www.osteopatheoullins.com/post/rgo-b%C3%A9b%C3%A9-ost%C3%A9opathe-%C3%A0-oullins-lyon-6', image: 'journal-rgo-bebe.webp', ph: 'bebe' },
  { titre: 'Douleurs lombaires à Oullins et Lyon 6 : traitement naturel et ostéopathie', cat: 'dos', catLabel: 'Dos', lecture: 6, date: '26 mai 2026',
    url: 'https://www.osteopatheoullins.com/post/douleurs-lombaires-oullins-et-lyon-6-traitement-naturel-ost%C3%A9opathie', image: 'journal-lombaires.webp', ph: 'dos' },
  { titre: 'Prévention de la sciatique par l’ostéopathie à Oullins : guide complet', cat: 'dos', catLabel: 'Dos', lecture: 7, date: '13 mars 2026',
    url: 'https://www.osteopatheoullins.com/post/pr%C3%A9vention-sciatique-ost%C3%A9opathie-%C3%A0-oullins-guide-complet-2026', image: 'journal-sciatique.webp', ph: 'dos' }
];

/* Événements : triés automatiquement entre à venir et passés. */
export const EVENEMENTS = [
  {
    date: '2025-10-14T20:30:00+02:00',
    titre: 'Réflexes primaires et neurologie fonctionnelle : une nouvelle synergie pour les praticiens',
    lieu: 'En ligne', tarif: '15 €', organisateur: 'AFReM',
    url: 'https://www.osteopatheoullins.com/post/r%C3%A9flexes-primaires-neurologie-fonctionnelle-une-nouvelle-synergie-pour-les-praticiens'
  }
];

/* Images disponibles. Vide pour la v1 : chaque emplacement affiche un visuel provisoire dessiné en code.
   Format : 'nom.webp': { w: 1600, h: 2000, alt: '…', sizes: [800, 1600] } */
export const IMAGES = {
  "brice-portrait.webp": {
    "w": 1417,
    "h": 1771,
    "alt": "Brice Bourdon, ostéopathe D.O., bras croisés",
    "sizes": [
      800,
      1417
    ]
  },
  "brice-auteur.webp": {
    "w": 1333,
    "h": 1666,
    "alt": "Brice Bourdon au cabinet",
    "sizes": [
      800,
      1333
    ]
  },
  "seance-photo.webp": {
    "w": 1600,
    "h": 1067,
    "alt": "Brice Bourdon pendant une séance, mains sous la nuque d’une patiente allongée",
    "sizes": [
      800,
      1600
    ]
  },
  "rdv-echange.webp": {
    "w": 1600,
    "h": 1067,
    "alt": "Premier échange au bureau du cabinet avant la séance",
    "sizes": [
      800,
      1600
    ]
  },
  "profil-dos.webp": {
    "w": 1333,
    "h": 1666,
    "alt": "Prise en charge du bas du dos sur la table de soin",
    "sizes": [
      800,
      1333
    ]
  },
  "profil-tete.webp": {
    "w": 1066,
    "h": 1333,
    "alt": "Mains de l’ostéopathe sous la nuque d’une patiente",
    "sizes": [
      800,
      1066
    ]
  },
  "profil-vertiges.webp": {
    "w": 1333,
    "h": 1666,
    "alt": "Pieds posés sur une plateforme d’analyse de l’équilibre",
    "sizes": [
      800,
      1333
    ]
  },
  "profil-enfant.webp": {
    "w": 1273,
    "h": 1592,
    "alt": "Enfant allongée sur un tapis pendant un bilan des réflexes",
    "sizes": [
      800,
      1273
    ]
  },
  "profil-sport.webp": {
    "w": 1200,
    "h": 1500,
    "alt": "Mobilisation du genou d’un patient",
    "sizes": [
      800,
      1200
    ]
  },
  "profil-nourrisson.webp": {
    "w": 1066,
    "h": 1333,
    "alt": "Nourrisson allongé, mains de l’ostéopathe",
    "sizes": [
      800,
      1066
    ]
  },
  "approche-mesure.webp": {
    "w": 1066,
    "h": 1333,
    "alt": "Mesure posturale au niveau des omoplates",
    "sizes": [
      800,
      1066
    ]
  },
  "posture-fil-a-plomb.webp": {
    "w": 1333,
    "h": 1666,
    "alt": "Brice Bourdon place un fil à plomb derrière une patiente debout",
    "sizes": [
      800,
      1333
    ]
  },
  "cabinet-oullins.webp": {
    "w": 1600,
    "h": 1066,
    "alt": "Salle de consultation du cabinet",
    "sizes": [
      800,
      1600
    ]
  },
  "cabinet-entree.webp": {
    "w": 1600,
    "h": 1066,
    "alt": "Entrée du bâtiment du cabinet",
    "sizes": [
      800,
      1600
    ]
  },
  "journal-mal-de-tete.webp": {
    "w": 1600,
    "h": 1000,
    "alt": "Homme se tenant les tempes",
    "sizes": [
      800,
      1600
    ]
  },
  "journal-migraine.webp": {
    "w": 1600,
    "h": 1000,
    "alt": "Femme se tenant la tête",
    "sizes": [
      800,
      1600
    ]
  },
  "journal-reflexes-enfant.webp": {
    "w": 1600,
    "h": 1000,
    "alt": "Enfant en appui sur un ballon pendant une séance",
    "sizes": [
      800,
      1600
    ]
  },
  "journal-entorse.webp": {
    "w": 1333,
    "h": 833,
    "alt": "Mobilisation de la cheville sur la table de soin",
    "sizes": [
      800,
      1333
    ]
  },
  "article-vertiges.webp": {
    "w": 1600,
    "h": 900,
    "alt": "Test visuel pendant un bilan postural",
    "sizes": [
      800,
      1600
    ]
  },
  "journal-rgo-bebe.webp": {
    "w": 1600,
    "h": 1000,
    "alt": "Mains posées doucement sur la tête d’un nourrisson",
    "sizes": [
      800,
      1600
    ]
  },
  "journal-lombaires.webp": {
    "w": 1333,
    "h": 833,
    "alt": "Séance pour le bas du dos",
    "sizes": [
      800,
      1333
    ]
  },
  "journal-sciatique.webp": {
    "w": 1333,
    "h": 833,
    "alt": "Brice Bourdon montre un modèle de colonne vertébrale",
    "sizes": [
      800,
      1333
    ]
  },
  "reflexes-hero.webp": {
    "w": 1600,
    "h": 900,
    "alt": "Enfant en appui sur un ballon, guidé par Brice Bourdon",
    "sizes": [
      800,
      1600
    ]
  },
  "reflexes-hero-mobile.webp": {
    "w": 1066,
    "h": 1333,
    "alt": "Enfant en appui sur un ballon, guidé par Brice Bourdon",
    "sizes": [
      800,
      1066
    ]
  },
  "reflexes-bilan.webp": {
    "w": 1600,
    "h": 1067,
    "alt": "Exercice de coordination des mains pendant un bilan",
    "sizes": [
      800,
      1600
    ]
  },
  "reflexes-ado.webp": {
    "w": 1333,
    "h": 1666,
    "alt": "Adolescent face à Brice Bourdon pendant un exercice",
    "sizes": [
      800,
      1333
    ]
  },
  "reflexes-adulte.webp": {
    "w": 1600,
    "h": 2000,
    "alt": "Analyse posturale d’une adulte debout",
    "sizes": [
      800,
      1600
    ]
  },
  "reflexes-conference.webp": {
    "w": 1600,
    "h": 2000,
    "alt": "Affiche de la conférence en ligne AFReM du 14 octobre 2025",
    "sizes": [
      800,
      1600
    ]
  },
  "logo-brice-bourdon.webp": {
    "w": 1600,
    "h": 610,
    "alt": "Logo Brice Bourdon",
    "sizes": [
      800,
      1600
    ]
  }
};
