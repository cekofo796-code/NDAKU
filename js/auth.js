/* ==========================================================================
   auth.js
   Authentification 100% simulée côté client avec LocalStorage.

   ATTENTION — TRÈS IMPORTANT :
   Ceci N'EST PAS une authentification sécurisée. Les mots de passe sont
   stockés EN CLAIR dans le LocalStorage du navigateur, qui est facilement
   accessible et modifiable par l'utilisateur lui-même (DevTools).
   Cette approche sert UNIQUEMENT à démontrer le fonctionnement du frontend.

   Pour une vraie plateforme publique, il faudra impérativement :
   - un vrai backend (Node.js, Django, Firebase, Supabase...)
   - un hachage des mots de passe (bcrypt, argon2...)
   - des tokens de session sécurisés (JWT, cookies httpOnly...)
   - du HTTPS
   ========================================================================== */

function getUsers() {
  return JSON.parse(localStorage.getItem(NDAKU_KEYS.users)) || [];
}

function saveUsers(users) {
  localStorage.setItem(NDAKU_KEYS.users, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(NDAKU_KEYS.currentUser)) || null;
}

function registerUser({ name, email, phone, password }) {
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "Un compte existe déjà avec cet email." };
  }
  const user = { id: Date.now(), name, email, phone, password };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(
    NDAKU_KEYS.currentUser,
    JSON.stringify({ id: user.id, name, email, phone })
  );
  return { success: true };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: "Email ou mot de passe incorrect." };
  }
  localStorage.setItem(
    NDAKU_KEYS.currentUser,
    JSON.stringify({ id: user.id, name: user.name, email: user.email, phone: user.phone })
  );
  return { success: true };
}

function logoutUser() {
  localStorage.removeItem(NDAKU_KEYS.currentUser);
  window.location.href = "connexion.html";
}

/* Protège une page : redirige vers connexion.html si personne n'est connecté */
function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = "connexion.html";
  }
}
