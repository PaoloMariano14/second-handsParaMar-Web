/************************************************
 * 1️⃣ CARGÁ ACÁ TUS SECOND HANDS (opcional)
 * 👉 Podés dejarlo vacío y cargarlos desde el mapa
 ************************************************/
const initialPlaces = [
  {
    id: 1,
    name: "Ejemplo Second Hand",
    note: "Vintage / buena ropa",
    photo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    lat: -34.9011,
    lng: -56.1645,
    visited: false
  }
];

/************************************************
 * 2️⃣ MAPA
 ************************************************/
const map = L.map('map').setView([-34.9011, -56.1645], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const icon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

/************************************************
 * 3️⃣ DATA
 ************************************************/
let places = JSON.parse(localStorage.getItem('ropaPlaces'));

if (!places) {
  places = initialPlaces;
  localStorage.setItem('ropaPlaces', JSON.stringify(places));
}

const listDiv = document.getElementById('placesList');

places.forEach(p => addMarker(p));
renderList();

/************************************************
 * 4️⃣ AGREGAR DESDE EL MAPA
 ************************************************/
map.on('click', e => {
  const name = prompt("Nombre del second hand 👗");
  if (!name) return;

  const note = prompt("Nota (opcional)");
  const photo = prompt("URL de foto 📸");

  const place = {
    id: Date.now(),
    name,
    note,
    photo,
    lat: e.latlng.lat,
    lng: e.latlng.lng,
    visited: false
  };

  places.push(place);
  save();
  addMarker(place);
  renderList();
});

/************************************************
 * 5️⃣ FUNCIONES
 ************************************************/
function addMarker(place) {
  L.marker([place.lat, place.lng], { icon })
    .addTo(map)
    .bindPopup(`
      <strong>${place.name}</strong><br>
      ${place.note || ""}
      ${place.photo ? `<img src="${place.photo}" style="width:100%;border-radius:8px;margin-top:6px">` : ""}
    `);
}

function renderList() {
  listDiv.innerHTML = "";

  places.forEach(p => {
    const div = document.createElement("div");
    div.className = "place" + (p.visited ? " visitado" : "");

    div.innerHTML = `
      <strong>${p.name}</strong><br>
      ${p.note || ""}
      ${p.photo ? `<img src="${p.photo}">` : ""}
      <br>
      <button class="btn" onclick="toggleVisited(${p.id})">
        ${p.visited ? "💙 Visitado" : "🤍 Marcar visitado"}
      </button>
      <button class="btn-route" onclick="openRoute(${p.lat},${p.lng})">🧭 Ruta</button>
      <button class="btn-danger" onclick="removePlace(${p.id})">❌</button>
    `;
    listDiv.appendChild(div);
  });
}

function toggleVisited(id) {
  places = places.map(p =>
    p.id === id ? { ...p, visited: !p.visited } : p
  );
  save();
  renderList();
}

function removePlace(id) {
  places = places.filter(p => p.id !== id);
  save();
  location.reload();
}

function openRoute(lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    "_blank"
  );
}

function save() {
  localStorage.setItem('ropaPlaces', JSON.stringify(places));
}