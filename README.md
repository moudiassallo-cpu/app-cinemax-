📽️ Application Web de Cinéma Moderne et Interactive
Une application web complète de catalogue de films avec design moderne, fonctionnalités interactives et gestion des favoris.

🚀 Fonctionnalités
🎨 Design & Interface
Design moderne et immersif inspiré de l'univers cinématographique

Thèmes sombre/clair avec basculement automatique

Palette de couleurs élégante (mode sombre par défaut, mode clair optionnel)

Typographie lisible et cinématographique (Bebas Neue pour les titres, Montserrat pour le texte)

Design responsive (desktop, tablette, mobile)

🎬 Catalogue de Films
57 films réels et connus répartis en 7 genres :

🎬 Action (12 films)

😂 Comédie (10 films)

🎭 Drame (9 films)

🚀 Science-fiction (8 films)

🧟 Horreur (7 films)

💕 Romance (6 films)

👨‍👩‍👧 Animation (5 films)

Cartes de film interactives avec animations au survol

🔍 Système de Recherche & Filtrage
Recherche instantanée par titre, réalisateur ou acteurs

Filtres avancés par :

Genre

Année de sortie

Note minimale

Popularité

Tri multiple (titre, année, note, popularité)

❤️ Système de Favoris
Ajout/suppression de films aux favoris

Sauvegarde dans le localStorage du navigateur

Section dédiée avec compteur

Persistance des données entre les sessions

📱 Pages & Sections
Header : Logo, menu navigation, barre de recherche, bouton thème

Section Hero : Présentation immersive avec recherche rapide

Section Genres : Navigation par catégories avec compteurs

Section Films : Grille complète avec filtres

Section Favoris : Films sauvegardés par l'utilisateur

Footer : Liens utiles, réseaux sociaux, contact

🎥 Détails des Films
Page de détails complète en modal :

Synopsis

Casting complet

Informations techniques (durée, réalisateur, scénariste, pays)

Note et popularité

Lien vers bande-annonce YouTube

Bouton d'ajout aux favoris

🛠️ Technologies Utilisées
Frontend
HTML5 : Structure sémantique

CSS3 :

Variables CSS pour les thèmes

Flexbox et Grid pour les layouts

Animations et transitions CSS

Media queries pour le responsive

JavaScript Vanilla :

Manipulation du DOM

Gestion des événements

localStorage pour la persistance des données

Filtrage et tri dynamique

API & Services Externes
Google Fonts : Typographie (Bebas Neue, Montserrat)

Font Awesome : Icônes

Placeholder.com : Images de secours

The Movie Database (TMDb) : Affiches des films (avec fallback)

📁 Structure des Fichiers

cinemax/
├── index.html          # Page principale
├── style.css           # Styles CSS complets
├── app.js              # Logique JavaScript principale
├── movies-data.js      # Base de données des films (57 films)
└── README.md           # Documentation