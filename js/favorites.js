/* ==========================================================================
   favorites.js
   Gestion des favoris (coup de cœur) stockés dans le LocalStorage.
   Les favoris sont une simple liste d'ids de biens.
   ========================================================================== */

function getFavorites() {
  return JSON.parse(localStorage.getItem(NDAKU_KEYS.favorites)) || [];
}

function saveFavorites(ids) {
  localStorage.setItem(NDAKU_KEYS.favorites, JSON.stringify(ids));
}

function isFavorite(id) {
  return getFavorites().includes(Number(id));
}

function toggleFavorite(id) {
  id = Number(id);
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites(favorites);
  return favorites.includes(id);
}

function getFavoriteProperties() {
  const favorites = getFavorites();
  return getProperties().filter((p) => favorites.includes(p.id));
}

/* Délégation d'événement : écoute les clics sur tous les boutons ❤️ de la page,
   même ceux ajoutés dynamiquement après coup (cartes générées en JS). */
document.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-fav-id]");
  if (!btn) return;
  e.preventDefault();
  const id = btn.getAttribute("data-fav-id");
  const active = toggleFavorite(id);
  btn.classList.toggle("is-active", active);
  const path = btn.querySelector("path");
  if (path) path.setAttribute("fill", active ? "currentColor" : "none");
  showToast(active ? "Ajouté à vos favoris" : "Retiré de vos favoris");

  // Si on est sur la page favoris, on retire directement la carte de l'écran
  if (window.location.pathname.endsWith("favoris.html") && !active) {
    const card = btn.closest("[data-id]");
    if (card) {
      card.remove();
      if (typeof refreshFavoritesEmptyState === "function") refreshFavoritesEmptyState();
    }
  }
});
