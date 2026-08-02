# Plateforme de Gestion des Formations

Application web de gestion de cycles de formation, d'inscriptions, de participants et de statistiques, avec back-office administrateur complet.

## 📸 Aperçu

<!-- Ajoutez vos captures d'écran ici, par exemple : -->
<!-- ![Dashboard](docs/images/dashboard.png) -->
<!-- ![Liste des formations](docs/images/formations.png) -->

## 🛠️ Stack technique

**Frontend**
- Angular 16
- ng2-charts / Chart.js (visualisation de données)
- ngx-translate (internationalisation FR/EN)
- SweetAlert2 (confirmations et alertes)
- Font Awesome (icônes)

**Backend**
- Node.js 18
- Express
- MongoDB avec Mongoose
- JWT (authentification)
- bcrypt (hachage des mots de passe)
- Multer (upload d'images)

## ✨ Fonctionnalités

### Espace Administrateur
- **Tableau de bord** : statistiques globales (formations, inscriptions, participants) avec graphiques (barres, camembert, courbe)
- **Cycle de formations** : création, édition, archivage/désarchivage, recherche, filtres par mode (En ligne / Présentiel / Hybride) et par statut, pagination
- **Liste des inscrits** : validation/refus des inscriptions, recherche, tri
- **Croissance des utilisateurs** : répartition par âge, par genre, statut actif/inactif, courbe de croissance
- **Messages de contact** : consultation, marquage comme lu/répondu, suppression avec confirmation, réponse par e-mail

### Espace Participant
- Inscription et connexion (JWT)
- Consultation des formations disponibles
- Inscription aux formations

### Général
- Interface multilingue (Français / Anglais)
- Interface responsive (desktop et mobile)
- Emails automatiques (email de bienvenue à l'inscription)

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- MongoDB (local ou distant, ex. MongoDB Atlas)
- npm

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-utilisateur>/<nom-du-repo>.git
cd <nom-du-repo>
```

### 2. Configurer le backend

```bash
cd backend
npm install
```

Créez un fichier `.env` à la racine du dossier `backend`, en vous basant sur `.env.example` :

```
MONGO_URI=mongodb://localhost:27017/nom_de_la_base
JWT_SECRET=votre_secret_jwt
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=votre_email
MAIL_PASS=votre_mot_de_passe
PORT=3000
```

(Optionnel) Peupler la base de données avec des données de test :

```bash
node seeders/seed.js
node seeders/seed-formations.js
```

Démarrer le serveur backend :

```bash
npm start
```

Le backend est accessible sur `http://localhost:3000`.

### 3. Configurer le frontend

Dans un nouveau terminal :

```bash
cd frontend
npm install
ng serve
```

L'application est accessible sur `http://localhost:4200`.

## 📁 Structure du projet

```
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── seeders/
│   ├── uploads/        (non versionné, contient les images utilisateurs)
│   └── .env             (non versionné)
│
└── frontend/
    └── src/
        └── app/
            ├── admin-dashboard/
            ├── cycle-formations/
            ├── liste-inscrits/
            ├── users-growth/
            ├── admin-messages/
            └── core/
                └── services/
```

## 🌍 Traductions

Les fichiers de traduction se trouvent dans `frontend/src/assets/i18n/` :
- `en.json`
- `fr.json`
