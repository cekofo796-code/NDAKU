/* ==========================================================================
   search.js
   Filtrage et tri des biens. Fonctions pures réutilisées sur plusieurs
   pages (accueil, acheter, louer, projets-neufs).
   ========================================================================== */

/* Filtre une liste de biens selon un objet de filtres */
function filterProperties(properties, filters) {
  return properties.filter((p) => {
    if (p.status === "supprimé") return false;

    if (filters.transaction && p.transaction !== filters.transaction) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.commune && !p.commune.toLowerCase().includes(filters.commune.toLowerCase()))
      return false;
    if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
    if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
    if (filters.bathrooms && p.bathrooms < Number(filters.bathrooms)) return false;
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      const haystack = `${p.title} ${p.description} ${p.city} ${p.commune}`.toLowerCase();
      if (!haystack.includes(k)) return false;
    }
    return true;
  });
}

/* Trie une liste de biens */
function sortProperties(properties, sortBy) {
  const list = [...properties];
  switch (sortBy) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "recent":
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "popular":
      return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
    default:
      return list;
  }
}

/* Lit les filtres depuis un formulaire de recherche présent sur la page */
function readFiltersFromForm(form) {
  const data = new FormData(form);
  const filters = {};
  for (const [key, value] of data.entries()) {
    if (value) filters[key] = value;
  }
  return filters;
}

/* Lit les filtres depuis les paramètres de l'URL (?type=Maison&city=Kinshasa...) */
function readFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filters = {};
  for (const [key, value] of params.entries()) {
    if (value) filters[key] = value;
  }
  return filters;
}

/* Construit une chaîne de requête URL à partir d'un objet de filtres */
function buildQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

/* Affiche un état "vide" quand aucun résultat ne correspond */
function renderEmptyState(message) {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48"><path d="M11 19a8 8 0 1 1 5.29-14.02M21 21l-4.35-4.35" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
      <p>${message || "Aucun bien ne correspond à votre recherche."}</p>
      <p class="empty-state__hint">Essayez d'élargir vos critères (ville, prix, type de bien).</p>
    </div>
  `;
}
