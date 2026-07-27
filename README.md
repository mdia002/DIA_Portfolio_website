# Portfolio - Mouhamed Dia

Data Analyst orienté BI, automatisation et IA. Ce repo contient le code source
de mon portfolio professionnel : dashboards Power BI, pipelines ETL Python,
computer vision, agents IA - avec pour chaque projet l'objectif, le workflow,
l'interface et les résultats, et une mention explicite du niveau de confidentialité.

🔗 **Site en ligne** : https://github.com/mdia002/DIA_Portfolio_website.git
    **LinkedIn** : https://www.linkedin.com/in/mouhamed-dia-data/

---

## Aperçu

Site statique en HTML/CSS/JavaScript pur (sans framework, sans build), piloté
par un fichier de données `data/projects.json`.

## Stack technique

- **HTML5 / CSS3 / JavaScript (ES6+)** - vanilla, aucune dépendance externe
- **Architecture data-driven** - contenu des projets et certifications en JSON
- Polices : Space Grotesk, IBM Plex Sans, IBM Plex Mono (Google Fonts)

## Fonctionnalités

- Filtrage des projets par domaine (Power BI, Automatisation, IA, Agentic IA, Applications)
- Fiches projet détaillées : objectif, outils, workflow, captures d'écran, résultats
- Gestion de la confidentialité par projet (public / confidentiel, avec note explicative)
- Sous-projets en accordéon pour les missions regroupées (ex. plusieurs dashboards Power BI)
- Section certifications avec statut (obtenue / en cours / prévue)

## Structure
portfolio/
├── index.html # page d'accueil
├── project.html # template unique de fiche projet
├── css/style.css
├── js/
│ ├── icons.js
│ └── app.js
├── data/
│ └── projects.json # tout le contenu des projets et certifications
├── images/ # captures d'écran + schémas de workflow
├── assets/ # CV, certifications, bannière, photo de profil
└── nginx/portfolio.conf # config Nginx d'exemple (hébergement VPS)

## Ajouter un projet

1. Ouvrir `data/projects.json`
2. Dupliquer un bloc de la liste `projects` (ou `subprojects` pour un cas dans
   un projet existant)
3. Remplir les champs : `objective`, `tools`, `languages`, `workflowSteps`,
   `screenshots`, `usageSteps`, `results`, `code`, `confidential`
4. Déposer les images correspondantes dans `images/projects/`

## Déploiement
Sur Github Pages et mon VPS
Voir les instructions détaillées plus bas dans ce fichier (GitHub Pages et VPS).

## Contact

📧 mouhamed.92.dia@gmail.com

