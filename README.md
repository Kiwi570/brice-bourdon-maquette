# Maquette Brice Bourdon · direction « Axe »

Site statique (HTML, CSS, JavaScript), sans étape de construction, prêt pour Vercel.

## Pages

- `index.html` : accueil
- `reflexes-archaiques.html` : page type « prestation »
- `journal/vertiges-troubles-equilibre.html` : page type « article » (texte repris du site actuel)

## Mettre à jour le contenu

Toutes les données qui changent sont dans `assets/js/data.js` : coordonnées, cabinets et horaires, tarifs, articles du journal, événements (triés automatiquement entre à venir et passés) et liste des images disponibles.

Une image s’ajoute en deux temps : déposer `nom-800.webp` et `nom-1600.webp` dans `assets/img/`, puis déclarer `nom.webp` dans `IMAGES`. Tant qu’une image n’est pas déclarée, son emplacement affiche un visuel provisoire dessiné en code.

## Images

- 29 photos reprises du site actuel, recadrées et converties en WebP.
- 5 images générées : `profil-grossesse`, `tarifs-drap`, `hero-texture` (ordinateur et téléphone, derrière la colonne, ombre alignée sur l’axe) et `article-vertiges-horizon` (l’horizon se remet de niveau au défilement).
- Reste à fournir : `cabinet-lyon6`, une vraie photo du cabinet du 19 rue Godefroy.

## Modes de secours

- `?calme=1` ou bouton « Mode calme » : animations réduites, version complète et lisible.
- `?sans-webgl=1` : colonne vertébrale dessinée en Canvas 2D au lieu de WebGL.
- `prefers-reduced-motion` est respecté par défaut.

## À compléter ou valider avec Brice Bourdon

- Numéro à mettre en avant : 06 86 70 59 26 (partout sur le site) ou 04 87 37 65 64 (page Contact). Un article indique 06 86 70 59 56.
- Adresse de Lyon 6 : « 19 rue Godefroy » partout, sauf une fois « 9 rue Godefroy ».
- Horaires par cabinet (le site donne un seul bloc : lundi–vendredi 8 h–20 h, samedi 14 h–19 h).
- Photo du cabinet de Lyon 6 (seul emplacement encore provisoire), et confirmation du cabinet visible sur la photo de salle reprise du site.
- Déroulé d’une séance d’ostéopathie (étapes proposées dans la maquette).
- Chiffres affichés par le site : « +20 000 patients », « 5/5, plus de 250 avis Google ». À vérifier au moment de la mise en ligne.
- Année du diplôme de masso-kinésithérapie.
- Mentions légales à mettre à jour (le texte actuel cite encore la directive de 1995) et politique de confidentialité RGPD à rédiger.
- Logo : le logo actuel est aubergine. La maquette utilise le nom en texte ; à décider si l’on garde le bleu « signal » ou si l’on reprend la couleur du logo.

## Reformulations faites pour rester dans le cadre de la profession

Le décret n° 2007-435 limite l’ostéopathie aux troubles fonctionnels (hors pathologies organiques) et impose un diagnostic médical préalable pour les manipulations du crâne, de la face et du rachis du nourrisson de moins de 6 mois. La maquette :

- ne reprend pas les promesses de résultat (« soulagement durable », « agit sur ovaires, thyroïde, surrénales ») ;
- ne présente pas l’endométriose, le SOPK, le TDAH, les troubles DYS, le HPI ou les acouphènes comme des indications : elle parle d’accompagnement en complément du suivi médical ;
- ajoute la mention du certificat médical pour les nourrissons de moins de 6 mois et l’absence de manipulation gynéco-obstétricale ;
- ne reprend pas le témoignage de la page Réflexes archaïques, qui laisse entendre un résultat ;
- ne reprend pas les chiffres non sourcés de certains articles (« 82 % des Français… », « 60 % des lombalgies… », « récidive réduite de 60 % ») ;
- remplace « urgences ostéopathiques » par une orientation claire vers le 15 ou le 112 en cas de signe d’alerte.

## Démonstrations

La réservation est simulée (créneaux fictifs, aucun envoi) et renvoie vers Doctolib. La colonne vertébrale, le statokinésigramme et les angles affichés sont des visualisations illustratives.

## Bibliothèques et polices hébergées avec le site

GSAP 3.15 (ScrollTrigger, SplitText, licence GreenSock sans frais), Lenis 1.3 (MIT), OGL (Unlicense), Geist et Geist Mono (SIL Open Font License).
