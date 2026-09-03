/* ==========================================================================
   dashboard.js
   Alimente le tableau de bord : statistiques + gestion des annonces
   de l'utilisateur connecté.
   ========================================================================== */

function initDashboard() {
  const dashboardRoot = document.getElementById("dashboard-content");
  if (!dashboardRoot) return;

  requireAuth();
  const user = getCurrentUser();

  const welcomeName = document.getElementById("welcome-name");
  if (welcomeName) welcomeName.textContent = user.name.split(" ")[0];

  renderStats();
  renderMyListings();

  document.getElementById("logout-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
  });
}

function renderStats() {
  const mine = getMyProperties();
  const favorites = getFavorites();

  const stats = {
    total: mine.length,
    active: mine.filter((p) => p.status === "actif").length,
    pending: mine.filter((p) => p.status === "en attente").length,
    favorites: favorites.length,
  };

  const statEls = {
    "stat-total": stats.total,
    "stat-active": stats.active,
    "stat-pending": stats.pending,
    "stat-favorites": stats.favorites,
  };

  Object.entries(statEls).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function renderMyListings() {
  const list = document.getElementById("my-listings");
  if (!list) return;

  const mine = getMyProperties();

  if (mine.length === 0) {
    list.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <p>Vous n'avez publié aucune annonce pour le moment.</p>
            <a href="publier.html" class="btn btn--gold btn--small">Publier ma première annonce</a>
          </div>
        </td>
      </tr>`;
    return;
  }

  list.innerHTML = mine
    .map(
      (p) => `
    <tr data-row-id="${p.id}">
      <td class="listing-title">
        <img src="${p.images[0] || ""}" alt="">
        <span>${escapeHtml(p.title)}</span>
      </td>
      <td>${formatPrice(p.price, p.transaction)}</td>
      <td><span class="status-pill status-pill--${statusClass(p.status)}">${p.status}</span></td>
      <td>${p.createdAt}</td>
      <td class="listing-actions">
        <a href="details.html?id=${p.id}" title="Voir">Voir</a>
        <a href="publier.html?edit=${p.id}" title="Modifier">Modifier</a>
        <button data-toggle-status="${p.id}" title="Changer le statut">${p.status === "actif" ? "Désactiver" : "Activer"}</button>
        <button data-delete-id="${p.id}" class="danger" title="Supprimer">Supprimer</button>
      </td>
    </tr>`
    )
    .join("");

  list.querySelectorAll("[data-delete-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirmAction("Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.")) {
        deleteProperty(btn.dataset.deleteId);
        showToast("Annonce supprimée");
        renderStats();
        renderMyListings();
      }
    });
  });

  list.querySelectorAll("[data-toggle-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.toggleStatus;
      const property = getPropertyById(id);
      const newStatus = property.status === "actif" ? "inactif" : "actif";
      updateProperty(id, { status: newStatus });
      showToast(`Annonce ${newStatus === "actif" ? "activée" : "désactivée"}`);
      renderStats();
      renderMyListings();
    });
  });
}

function statusClass(status) {
  if (status === "actif") return "success";
  if (status === "en attente") return "pending";
  return "inactive";
}

document.addEventListener("DOMContentLoaded", initDashboard);
