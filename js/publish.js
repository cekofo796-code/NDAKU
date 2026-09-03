/* ==========================================================================
   publish.js
   Gère le formulaire de publication (et de modification) d'une annonce.
   Les images choisies par l'utilisateur sont converties en base64 et
   stockées directement dans le LocalStorage (limite : LocalStorage ~5Mo,
   donc à remplacer par un vrai stockage fichiers — Firebase Storage,
   Supabase Storage, S3... — lors du passage à un vrai backend).
   ========================================================================== */

const MAX_IMAGES = 6;
let selectedImages = []; // tableau de chaînes base64

function initPublishForm() {
  const form = document.getElementById("publish-form");
  if (!form) return;

  requireAuth();

  const editId = new URLSearchParams(window.location.search).get("edit");
  const imageInput = document.getElementById("images");
  const preview = document.getElementById("image-preview");

  if (editId) {
    const property = getPropertyById(editId);
    if (property) {
      document.getElementById("form-title").textContent = "Modifier l'annonce";
      document.getElementById("submit-btn").textContent = "Enregistrer les modifications";
      fillFormWithProperty(form, property);
      selectedImages = property.images || [];
      renderImagePreview(preview);
    }
  }

  imageInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES - selectedImages.length);
    if (files.length === 0) {
      showToast("Maximum 6 images par annonce", "error");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        selectedImages.push(reader.result);
        renderImagePreview(preview);
      };
      reader.readAsDataURL(file);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      showToast("Ajoutez au moins une photo", "error");
      return;
    }

    const user = getCurrentUser();
    const data = new FormData(form);
    const property = {
      title: data.get("title"),
      type: data.get("type"),
      transaction: data.get("transaction"),
      price: Number(data.get("price")),
      city: data.get("city"),
      commune: data.get("commune"),
      quartier: data.get("quartier"),
      address: data.get("address"),
      bedrooms: Number(data.get("bedrooms") || 0),
      bathrooms: Number(data.get("bathrooms") || 0),
      area: Number(data.get("area")),
      description: data.get("description"),
      phone: data.get("phone"),
      features: (data.get("features") || "")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      images: selectedImages,
      owner: user.name,
      ownerEmail: user.email,
      featured: false,
    };

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Publication en cours...";

    setTimeout(() => {
      if (editId) {
        updateProperty(editId, property);
        showToast("Annonce mise à jour avec succès");
      } else {
        addProperty(property);
      }
      submitBtn.disabled = false;
      document.getElementById("publish-success").hidden = false;
      form.hidden = true;
    }, 600);
  });
}

function fillFormWithProperty(form, property) {
  form.title.value = property.title;
  form.type.value = property.type;
  form.transaction.value = property.transaction;
  form.price.value = property.price;
  form.city.value = property.city;
  form.commune.value = property.commune;
  form.quartier.value = property.quartier || "";
  form.address.value = property.address || "";
  form.bedrooms.value = property.bedrooms;
  form.bathrooms.value = property.bathrooms;
  form.area.value = property.area;
  form.description.value = property.description;
  form.phone.value = property.phone;
  form.features.value = (property.features || []).join(", ");
}

function renderImagePreview(container) {
  container.innerHTML = selectedImages
    .map(
      (img, i) => `
      <div class="image-preview__item">
        <img src="${img}" alt="Photo ${i + 1}">
        <button type="button" data-remove-image="${i}" aria-label="Supprimer cette photo">&times;</button>
      </div>`
    )
    .join("");

  container.querySelectorAll("[data-remove-image]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedImages.splice(Number(btn.dataset.removeImage), 1);
      renderImagePreview(container);
    });
  });
}

document.addEventListener("DOMContentLoaded", initPublishForm);
