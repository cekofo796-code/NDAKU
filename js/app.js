/* ==========================================================================
   app.js
   Script principal chargé sur toutes les pages :
   - injecte le header et le footer (pour ne pas dupliquer le HTML partout)
   - gère le menu mobile (hamburger)
   - gère les petites notifications ("toasts")
   - met en avant le lien de navigation actif
   ========================================================================== */

const NDAKU_NAV_LINKS = [
  { href: "index.html", label: "Accueil" },
  { href: "acheter.html", label: "Acheter" },
  { href: "louer.html", label: "Louer" },
  { href: "projets-neufs.html", label: "Projets neufs" },
  { href: "a-propos.html", label: "À propos" },
  { href: "blog.html", label: "Blog" },
  { href: "contact.html", label: "Contact" },
];

function currentPageName() {
  const path = window.location.pathname.split("/").pop();
  return path || "index.html";
}

function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const page = currentPageName();
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  const navHtml = NDAKU_NAV_LINKS.map(
    (link) =>
      `<li><a href="${link.href}" class="${link.href === page ? "is-active" : ""}">${link.label}</a></li>`
  ).join("");

  header.innerHTML = `
    <div class="header__inner container">
      <a href="index.html" class="logo">
        <span class="logo__main">NDAKU</span>
        <span class="logo__sub">IMMOBILIER</span>
      </a>

      <nav class="main-nav" id="main-nav">
        <ul>${navHtml}</ul>
      </nav>

      <div class="header__actions">
        <a href="publier.html" class="btn btn--gold btn--small header__publish">Publier une annonce</a>
        ${
          user
            ? `<a href="dashboard.html" class="header__user" title="${escapeHtmlSafe(user.name)}">
                <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="8" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.6-3.6 5-5 7.5-5s5.9 1.4 7.5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
              </a>`
            : `<a href="connexion.html" class="header__user" title="Connexion">
                <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="8" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.6-3.6 5-5 7.5-5s5.9 1.4 7.5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
              </a>`
        }
        <button class="hamburger" id="hamburger" aria-label="Ouvrir le menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;

  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("main-nav");
  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });
}

function escapeHtmlSafe(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="container footer__grid">
      <div>
        <a href="index.html" class="logo logo--footer">
          <span class="logo__main">NDAKU</span>
          <span class="logo__sub">IMMOBILIER</span>
        </a>
        <p class="footer__tagline">Trouvez. Visitez. Vivez.</p>
        <div class="footer__social">
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="LinkedIn">IN</a>
        </div>
      </div>
      <div>
        <h4>Explorer</h4>
        <ul>
          <li><a href="acheter.html">Acheter</a></li>
          <li><a href="louer.html">Louer</a></li>
          <li><a href="projets-neufs.html">Projets neufs</a></li>
          <li><a href="favoris.html">Mes favoris</a></li>
        </ul>
      </div>
      <div>
        <h4>NDAKU</h4>
        <ul>
          <li><a href="a-propos.html">À propos</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="publier.html">Publier une annonce</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li>+243 810 000 000</li>
          <li>contact@ndaku.cd</li>
          <li>Kinshasa, RD Congo</li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom container">
      <p>&copy; ${new Date().getFullYear()} NDAKU Immobilier. Tous droits réservés.</p>
    </div>
  `;
}

/* Petites notifications élégantes en bas de l'écran */
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* Boîte de confirmation simple avant suppression */
function confirmAction(message) {
  return window.confirm(message);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
