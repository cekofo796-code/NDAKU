/* ==========================================================================
   data.js
   Gère l'initialisation de la "base de données locale" (LocalStorage).
   NDAKU n'a PAS de backend : toutes les données (biens, utilisateurs,
   favoris, messages) sont stockées dans le LocalStorage du navigateur.

   Quand un vrai backend sera ajouté (Firebase / Supabase / API Node...),
   ce fichier sera remplacé par de vrais appels réseau (fetch/API).
   ========================================================================== */

const NDAKU_KEYS = {
  properties: "ndaku_properties",
  users: "ndaku_users",
  currentUser: "ndaku_current_user",
  favorites: "ndaku_favorites",
  messages: "ndaku_messages",
};

/* Biens de démonstration pour que le site soit utilisable immédiatement */
const DEMO_PROPERTIES = [
  {
    id: 1,
    title: "Appartement moderne 3 chambres",
    type: "Appartement",
    transaction: "vente",
    status: "actif",
    price: 120000,
    city: "Kinshasa",
    commune: "Gombe",
    quartier: "Centre-ville",
    address: "Avenue du Commerce",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description:
      "Bel appartement lumineux au 3e étage, cuisine équipée, double salon, vue dégagée. Proche des commerces et des écoles internationales.",
    features: ["Climatisation", "Parking", "Sécurité 24h/24", "Groupe électrogène"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 001",
    owner: "Agence Kin Immo",
    featured: true,
    createdAt: "2026-08-20",
  },
  {
    id: 2,
    title: "Villa avec piscine à Ma Campagne",
    type: "Maison",
    transaction: "vente",
    status: "actif",
    price: 350000,
    city: "Kinshasa",
    commune: "Ngaliema",
    quartier: "Ma Campagne",
    address: "Rue des Palmiers",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    description:
      "Magnifique villa familiale avec piscine, jardin arboré et garage double. Quartier résidentiel calme et sécurisé.",
    features: ["Piscine", "Jardin", "Garage double", "Climatisation", "Groupe électrogène"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 002",
    owner: "Jean-Pierre M.",
    featured: true,
    createdAt: "2026-08-15",
  },
  {
    id: 3,
    title: "Studio meublé proche université",
    type: "Appartement",
    transaction: "location",
    status: "actif",
    price: 450,
    city: "Kinshasa",
    commune: "Lemba",
    quartier: "Campus",
    address: "Avenue de l'Université",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    description:
      "Studio entièrement meublé idéal pour étudiant ou jeune professionnel. À deux pas de l'université.",
    features: ["Meublé", "Internet inclus", "Eau et électricité"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 003",
    owner: "Marie K.",
    featured: false,
    createdAt: "2026-08-25",
  },
  {
    id: 4,
    title: "Terrain viabilisé 500 m²",
    type: "Terrain",
    transaction: "vente",
    status: "actif",
    price: 45000,
    city: "Kinshasa",
    commune: "Kimwenza",
    quartier: "Route de Matadi",
    address: "Route de Matadi km 25",
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    description:
      "Terrain plat, viabilisé, titre foncier disponible. Idéal pour construction résidentielle.",
    features: ["Titre foncier", "Clôturé", "Accès route principale"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 004",
    owner: "Foncier Plus",
    featured: false,
    createdAt: "2026-07-30",
  },
  {
    id: 5,
    title: "Bureau climatisé centre d'affaires",
    type: "Bureau",
    transaction: "location",
    status: "actif",
    price: 1200,
    city: "Kinshasa",
    commune: "Gombe",
    quartier: "Boulevard du 30 juin",
    address: "Immeuble Crystal, 5e étage",
    bedrooms: 0,
    bathrooms: 1,
    area: 90,
    description:
      "Espace de bureau moderne dans immeuble sécurisé avec ascenseur, parking et salle de réunion partagée.",
    features: ["Climatisation", "Ascenseur", "Parking", "Salle de réunion"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 005",
    owner: "Crystal Business Center",
    featured: true,
    createdAt: "2026-08-01",
  },
  {
    id: 6,
    title: "Local commercial avenue commerçante",
    type: "Commerce",
    transaction: "location",
    status: "actif",
    price: 900,
    city: "Kinshasa",
    commune: "Kalamu",
    quartier: "Kasa-Vubu",
    address: "Avenue Kasa-Vubu",
    bedrooms: 0,
    bathrooms: 1,
    area: 60,
    description:
      "Local commercial à fort passage piéton, idéal pour boutique ou restaurant.",
    features: ["Vitrine", "Fort passage", "Électricité triphasée"],
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 006",
    owner: "Espace Commercial SARL",
    featured: false,
    createdAt: "2026-08-10",
  },
  {
    id: 7,
    title: "Résidence Les Palmiers — Projet neuf",
    type: "Projet neuf",
    transaction: "vente",
    status: "actif",
    price: 95000,
    city: "Kinshasa",
    commune: "Limete",
    quartier: "Résidentiel",
    address: "Avenue de la Paix",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    description:
      "Nouveau projet résidentiel de 40 appartements, livraison prévue en 2027. Paiement échelonné possible.",
    features: ["Paiement échelonné", "Livraison 2027", "Parking privé", "Espace vert"],
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 007",
    owner: "Promoteur Palmiers Immo",
    featured: true,
    createdAt: "2026-08-28",
  },
  {
    id: 8,
    title: "Maison 4 chambres à louer, Kintambo",
    type: "Maison",
    transaction: "location",
    status: "actif",
    price: 800,
    city: "Kinshasa",
    commune: "Kintambo",
    quartier: "Magasin",
    address: "Avenue Kintambo Magasin",
    bedrooms: 4,
    bathrooms: 2,
    area: 180,
    description:
      "Maison spacieuse avec cour, idéale pour famille. Quartier calme, proche des écoles.",
    features: ["Cour", "Parking", "Sécurisé"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    ],
    phone: "+243 810 000 008",
    owner: "Alain N.",
    featured: false,
    createdAt: "2026-08-05",
  },
];

/* Initialise le LocalStorage au premier chargement du site */
function ndakuInitData() {
  if (!localStorage.getItem(NDAKU_KEYS.properties)) {
    localStorage.setItem(NDAKU_KEYS.properties, JSON.stringify(DEMO_PROPERTIES));
  }
  if (!localStorage.getItem(NDAKU_KEYS.users)) {
    localStorage.setItem(NDAKU_KEYS.users, JSON.stringify([]));
  }
  if (!localStorage.getItem(NDAKU_KEYS.favorites)) {
    localStorage.setItem(NDAKU_KEYS.favorites, JSON.stringify([]));
  }
  if (!localStorage.getItem(NDAKU_KEYS.messages)) {
    localStorage.setItem(NDAKU_KEYS.messages, JSON.stringify([]));
  }
}

ndakuInitData();
