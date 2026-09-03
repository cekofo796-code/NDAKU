/* ==========================================================================
   properties.js
   Toutes les fonctions pour lire / créer / modifier / supprimer des biens
   dans le LocalStorage. C'est ici que se trouve la "logique métier".
   ========================================================================== */

/* Retourne la liste complète des biens */
function getProperties() {
  return JSON.parse(localStorage.getItem(NDAKU_KEYS.properties)) || [];
}

/* Sauvegarde la liste complète des biens */
function saveProperties(properties) {
  localStorage.setItem(NDAKU_KEYS.properties, JSON.stringify(properties));
}

/* Retourne un bien par son id */
function getPropertyById(id) {
  return getProperties().find((p) => p.id === Number(id));
}

/* Ajoute un nouveau bien (utilisé par publier.html) */
function addProperty(property) {
  const properties = getProperties();
  const newId = properties.length
    ? Math.max(...properties.map((p) => p.id)) + 1
    : 1;
  property.id = newId;
  property.createdAt = new Date().toISOString().slice(0, 10);
  property.status = "en attente"; // modération avant publication définitive
  properties.unshift(property);
  saveProperties(properties);
  return property;
}

/* Met à jour un bien existant */
function updateProperty(id, updates) {
  const properties = getProperties();
  const index = properties.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  properties[index] = { ...properties[index], ...updates };
  saveProperties(properties);
  return properties[index];
}

/* Supprime un bien */
function deleteProperty(id) {
  const properties = getProperties().filter((p) => p.id !== Number(id));
  saveProperties(properties);
}

/* Retourne les biens publiés par l'utilisateur actuellement connecté */
function getMyProperties() {
  const user = getCurrentUser();
  if (!user) return [];
  return getProperties().filter((p) => p.ownerEmail === user.email);
}

/* Formatage du prix avec séparateur de milliers */
function formatPrice(price, transaction) {
  const formatted = Number(price).toLocaleString("fr-FR");
  return transaction === "location" ? `$${formatted} / mois` : `$${formatted}`;
}

/* Construit le HTML d'une carte de bien immobilier */
function renderPropertyCard(property) {
  const isFav = isFavorite(property.id);
  const image =
    property.images && property.images.length
      ? property.images[0]
      : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
  const badge = property.transaction === "vente" ? "À vendre" : "À louer";

  return `
    <article class="property-card" data-id="${property.id}">
      <div class="property-card__image-wrap">
        <img src="${image}" alt="${escapeHtml(property.title)}" loading="lazy" class="property-card__image">
        <span class="property-card__badge">${badge}</span>
        <button class="property-card__fav ${isFav ? "is-active" : ""}" data-fav-id="${property.id}" aria-label="Ajouter aux favoris" title="Ajouter aux favoris">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2 4.5 5.6 4c2-.3 3.7.6 4.9 2.2C11.7 4.6 13.4 3.7 15.4 4c3.6.5 5.2 4.1 3.6 7.7C19.5 16.4 12 21 12 21z" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6"/></svg>
        </button>
      </div>
      <div class="property-card__body">
        <p class="property-card__price">${formatPrice(property.price, property.transaction)}</p>
        <h3 class="property-card__title"><a href="details.html?id=${property.id}">${escapeHtml(property.title)}</a></h3>
        <p class="property-card__location">${escapeHtml(property.commune)}, ${escapeHtml(property.city)}</p>
        <ul class="property-card__meta">
          ${property.bedrooms ? `<li>${property.bedrooms} ch.</li>` : ""}
          ${property.bathrooms ? `<li>${property.bathrooms} sdb</li>` : ""}
          <li>${property.area} m²</li>
        </ul>
        <a href="details.html?id=${property.id}" class="btn btn--outline btn--small">Voir le bien</a>
      </div>
    </article>
  `;
}

/* Petite sécurité anti-injection HTML pour les champs texte des annonces */
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
