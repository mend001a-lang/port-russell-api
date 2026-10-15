 Port de Plaisance Russell — API REST

 Présentation

Application web de gestion du Port de Plaisance Russell, réalisée dans le cadre du devoir de développement d'une API REST du Centre Européen de Formation (CEF).

L'application permet de gérer les utilisateurs, les catways (emplacements d'amarrage) et leurs réservations à travers une interface web et une API REST.

 Application en ligne

**Application hébergée sur Render :

[https://port-russell-api-xi9m.onrender.com](https://port-russell-api-xi9m.onrender.com)

Dépôt GitHub :

[https://github.com/mend001a-lang/port-russell-api](https://github.com/mend001a-lang/port-russell-api)

Branche contenant les corrections :** `correction-cef`

L'accès au tableau de bord nécessite une authentification.

#Technologies utilisées

- Node.js
- Express.js
- MongoDB et Mongoose
- JavaScript
- HTML et CSS
- JWT pour l'authentification
- Git et GitHub
- Render pour l'hébergement

Fonctionnalités

- Connexion et authentification des utilisateurs
- Accès à un tableau de bord
- Gestion des utilisateurs
- Consultation et gestion des catways
- Création, consultation, modification et suppression des réservations
- Validation des données saisies
- Gestion des erreurs et des codes HTTP
- Documentation de l'API

 Architecture du projet

Le projet utilise une organisation MVC afin de séparer progressivement les responsabilités.

- `models/` : modèles de données MongoDB
- `controllers/` : traitement des requêtes et logique métier
- `routes/` : définition des routes HTTP
- `middlewares/` : vérification de l'authentification
- `app.js` : configuration et démarrage de l'application

Certaines routes anciennes restent présentes dans `app.js`.

Installation locale

 Prérequis

- Node.js et npm
- MongoDB accessible localement ou à distance
- Git

 Étapes

Cloner la branche corrigée :

```bash
git clone -b correction-cef https://github.com/mend001a-lang/port-russell-api.git
```

Entrer dans le projet :

```bash
cd port-russell-api
```

Installer les dépendances :

```bash
npm install
```

Configurer les variables d'environnement dans un fichier `.env`, en reprenant les noms attendus par le code de l'application.

Les paramètres nécessaires comprennent notamment la connexion MongoDB et le secret utilisé pour les jetons JWT.

Ne jamais publier les véritables secrets ou identifiants dans GitHub.

Démarrer l'application :

```bash
node app.js
```

L'application locale est accessible à l'adresse :

[http://localhost:3001](http://localhost:3001)

 API REST

L'API permet notamment de gérer les catways et leurs réservations.

 Routes des réservations

| Méthode | Route                                     | Description                            |
| ------- | ----------------------------------------- | -------------------------------------- |
| GET     | `/catways/:id/reservations`               | Consulter les réservations d'un catway |
| GET     | `/catway/:id/reservations/:idReservation` | Consulter une réservation              |
| POST    | `/catways/:id/reservations`               | Créer une réservation                  |
| PUT     | `/catways/:id/reservations`               | Modifier une réservation               |
| DELETE  | `/catway/:id/reservations/:idReservation` | Supprimer une réservation              |

Ces routes nécessitent une authentification.

Gestion des erreurs

L'API utilise des codes HTTP adaptés aux différentes situations, notamment :

- `200` : requête réussie
- `201` : ressource créée
- `400` : données invalides
- `404` : ressource introuvable
- `409` : conflit de réservation
- `500` : erreur interne du serveur

 Authentification et sécurité

L'application utilise des jetons JWT et des cookies pour gérer les sessions authentifiées.

Les routes protégées vérifient la présence d'une authentification valide.

Les mots de passe et les informations sensibles ne doivent pas être publiés dans le dépôt GitHub.

 Tests

Des tests manuels ont été effectués avec le navigateur et des outils de test API, notamment Postman.

Les vérifications ont porté sur l'authentification, la consultation des données et plusieurs cas d'erreur.

Les opérations CRUD doivent être vérifiées dans leur ensemble avant toute validation définitive.

 Déploiement

L'application est hébergée sur Render.

Adresse publique :

[https://port-russell-api-xi9m.onrender.com](https://port-russell-api-xi9m.onrender.com)

La version corrigée est déployée depuis la branche `correction-cef`.

 Projet pédagogique

Ce projet a été réalisé dans le cadre du devoir " créer une API pour le port de Plaisance Russel"de la formation Développeur Web-Mobile du Centre Européen de Formation.

Son objectif est de mettre en pratique le développement d'une API REST avec Node.js, Express et MongoDB, ainsi que l'authentification, la structuration du code et la gestion des données.
