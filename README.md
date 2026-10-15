# 🩺 MediTech – Plateforme de Télémédecine Moderne

**MediTech** est une plateforme de télémédecine moderne permettant aux patients et aux médecins d’interagir facilement en ligne.  
Elle propose la prise de rendez-vous, la gestion des dossiers médicaux, un chat temps réel sécurisé et un chatbot médical intelligent basé sur l’IA de **Google Gemini**.

---

## 🚀 Fonctionnalités

### 👤 Utilisateurs (Patients)
- Inscription et connexion sécurisées (**JWT + bcrypt**)
- Prise de rendez-vous avec un médecin (par spécialité et disponibilité)
- Consultation des rendez-vous à venir et passés
- Chat en temps réel avec le médecin
- Accès au dossier médical partagé
- Utilisation du chatbot médical IA (**Gemini**) pour poser des questions de santé

### 👨‍⚕️ Médecins
- Gestion des patients et consultation de leurs dossiers
- Ajout, modification et suppression de dossiers médicaux
- Accès à la liste des rendez-vous planifiés
- Communication en temps réel avec les patients

### 🛠️ Administrateurs
- Gestion des utilisateurs (ajout, modification, suppression)
- Gestion des médecins et de leurs spécialités
- Suivi des statistiques globales (nombre d’utilisateurs, médecins, rendez-vous)

### 💬 Chat et Messagerie
- Chat en temps réel patient ↔ médecin (**Socket.IO**)
- Historique des conversations stocké en base de données
- Indicateur de messages lus / non lus

---

## 🧰 Stack Technique

### 🔙 Backend
- **Node.js + Express.js** (API REST et WebSocket)
- **MySQL + Sequelize + WampServer** (gestion de la base de données)
- **Socket.IO** (communication en temps réel)
- **JWT + bcrypt** (authentification et sécurité)
- **Google Gemini API** (chatbot médical)

### 🔜 Frontend
- **React.js** (interfaces utilisateurs)
- **React Router DOM** (navigation)
- **Tailwind CSS / Bootstrap** (design responsive)

### 🧪 Tests et Outils
- **Jest + Supertest** (tests unitaires et API)
- **Nodemon** (développement en hot-reload)
- **Dotenv** (gestion des variables d’environnement)

  ## 🔮 Axes d’Amélioration

### 🧠 Analyse médicale par IA
Implémenter un modèle capable de détecter automatiquement certaines pathologies  
*Exemple : dépistage du cancer du sein à partir d’images médicales*

---

### 📹 Téléconsultation vidéo
Ajouter une visioconférence sécurisée entre patients et médecins

---

### 💊 Ordonnances électroniques
Permettre aux médecins d’émettre des prescriptions numériques sécurisées

---

### 🧬 Système de recommandations personnalisées
L’IA pourrait proposer des conseils de prévention adaptés au profil du patient



---

## ⚙️ Installation et Démarrage

### 1️⃣ Backend
```bash
cd backend
npm install
npm run dev###

2️⃣ Frontend
```bash
cd client
npm install
npm start











