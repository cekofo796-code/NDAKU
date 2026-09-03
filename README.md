# NDAKU Immobilier — Frontend

Plateforme immobilière **100 % frontend** (HTML5, CSS3, JavaScript Vanilla) sans aucun backend. Toutes les données sont stockées dans le **LocalStorage** du navigateur.

## 1. Lancer NDAKU en local

Comme il n'y a pas de backend, il suffit d'ouvrir le site dans un navigateur :

**Option simple** : double-cliquez sur `index.html`.

**Option recommandée** (évite certains blocages du navigateur sur les fichiers locaux) : lancez un petit serveur local depuis le dossier du projet.

- Avec Python : `python3 -m http.server 8000` puis ouvrez `http://localhost:8000`
- Avec l'extension VS Code "Live Server" : clic droit sur `index.html` → "Open with Live Server"
- Avec Node.js : `npx serve .`

## 2. Ajouter des images

- **Photos des biens de démonstration** : elles pointent actuellement vers des images libres de droits (Unsplash). Modifiez le tableau `DEMO_PROPERTIES` dans `js/data.js` pour utiliser vos propres URLs, ou placez vos fichiers dans le dossier `images/` et remplacez les chemins.
- **Photos ajoutées via le formulaire "Publier une annonce"** : elles sont sélectionnées depuis l'appareil de l'utilisateur, converties en base64 par JavaScript (`FileReader`) et stockées directement dans le LocalStorage. Aucun fichier n'est réellement téléversé quelque part — c'est une limite normale d'un site sans backend.

## 3. Ajouter des biens de démonstration

Ouvrez `js/data.js` et ajoutez un nouvel objet au tableau `DEMO_PROPERTIES`, en respectant la structure existante (id unique, title, type, transaction, price, city, commune, bedrooms, bathrooms, area, description, images, phone, owner...).

Si le site a déjà été ouvert une fois dans le navigateur, le LocalStorage contient déjà une copie des données : videz le LocalStorage du site (DevTools → Application → Local Storage → clic droit → Clear) ou changez temporairement le nom de la clé `ndaku_properties` dans `js/data.js` pour forcer une réinitialisation.

## 4. Comment fonctionne le LocalStorage ici

Le fichier `js/data.js` définit les clés utilisées :

- `ndaku_properties` — tous les biens immobiliers
- `ndaku_users` — les comptes utilisateurs créés (inscription)
- `ndaku_current_user` — l'utilisateur actuellement connecté
- `ndaku_favorites` — la liste des ids de biens mis en favoris
- `ndaku_messages` — les messages envoyés depuis le formulaire de contact

Chaque fichier JS dédié (`properties.js`, `auth.js`, `favorites.js`) lit et écrit dans ces clés via `localStorage.getItem()` / `localStorage.setItem()`.

⚠️ Le LocalStorage est **propre à chaque navigateur et à chaque appareil** : un utilisateur qui se connecte depuis un autre téléphone ou un autre navigateur ne retrouvera pas ses données. C'est une des principales limites à lever avec un vrai backend.

## 5. Ce qui devra être remplacé par un vrai backend (Firebase / Supabase)

| Fonctionnalité actuelle (LocalStorage) | À remplacer par |
|---|---|
| `js/data.js` — tableau `DEMO_PROPERTIES` | Base de données Firestore (Firebase) ou table PostgreSQL (Supabase) |
| `js/auth.js` — inscription/connexion en clair | Firebase Authentication ou Supabase Auth (mots de passe hachés, sessions sécurisées) |
| `js/publish.js` — images en base64 dans LocalStorage | Firebase Storage ou Supabase Storage (upload réel de fichiers, URLs publiques) |
| `js/favorites.js` — favoris liés au navigateur | Collection "favorites" liée à l'`uid` de l'utilisateur connecté |
| `js/dashboard.js` — "mes annonces" filtrées localement | Requête serveur filtrée par utilisateur (avec règles de sécurité) |
| Formulaire de contact (`contact.html`) | Envoi vers une fonction serveur (Cloud Function / Edge Function) qui envoie un email ou enregistre en base |
| Modération des annonces (statut "en attente") | Un vrai espace admin côté serveur avec règles de validation |

**Important** : l'authentification actuelle n'est absolument pas sécurisée (mots de passe stockés en clair, données modifiables depuis les DevTools du navigateur). Elle sert uniquement à démontrer le fonctionnement du frontend et ne doit jamais être utilisée telle quelle sur un site public.

## 6. Structure du projet

```
NDAKU/
├── index.html, acheter.html, louer.html, projets-neufs.html,
│   details.html, publier.html, favoris.html, a-propos.html,
│   blog.html, contact.html, connexion.html, inscription.html,
│   dashboard.html
├── css/
│   ├── style.css        → design système + layout desktop
│   ├── responsive.css   → media queries (320px → 1440px)
│   └── dashboard.css    → styles de l'espace utilisateur
└── js/
    ├── data.js         → données de démo + initialisation LocalStorage
    ├── app.js          → header/footer, menu mobile, notifications
    ├── properties.js   → CRUD des biens (LocalStorage)
    ├── search.js       → filtres et tri
    ├── favorites.js    → gestion des favoris
    ├── auth.js         → inscription/connexion simulées
    ├── dashboard.js    → statistiques + gestion des annonces
    └── publish.js      → formulaire de publication / modification
```
