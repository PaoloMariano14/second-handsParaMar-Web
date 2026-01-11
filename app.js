/************************************************
 * 1️⃣ SECOND HANDS PRECARGADOS (OPCIONAL)
 * 👉 Podés dejarlos o borrarlos
 ************************************************/
const initialPlaces = [
  {
    id: 1,
    name: "Ejemplo Second Hand",
    note: "Ropa vintage y linda",
    photo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    address: "Montevideo",
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
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/69/69524.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
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
  const name = prompt("Nombre del second hand 🏬");
  if (!name) return;

  const note = prompt("Nota (opcional)");
  const photo = prompt("URL de foto 📸");
  const address = prompt("Dirección (ej: 18 de Julio 1234)");

  const place = {
    id: Date.now(),
    name,
    note,
    photo,
    address,
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
      ${place.note || ""}<br>
      ${
        place.address
          ? `<a href="#" onclick="openGoogle(${place.lat},${place.lng})">
               📍 ${place.address}
             </a><br>`
          : ""
      }
      ${
        place.photo
          ? `<img src="${place.photo}" style="width:100%;border-radius:10px;margin-top:6px">`
          : ""
      }
      <br><br>
      <button onclick="openGoogle(${place.lat},${place.lng})">🧭 Google Maps</button>
      <button onclick="openWaze(${place.lat},${place.lng})">🚗 Waze</button>
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
      <button class="btn-visit" onclick="toggleVisited(${p.id})">
        ${p.visited ? "❤️ Visitado juntos" : "🤍 Marcar visitado"}
      </button>
      <button class="btn-route" onclick="openGoogle(${p.lat},${p.lng})">
        🧭 Ruta
      </button>
      <button class="btn-danger" onclick="removePlace(${p.id})">
        ❌
      </button>
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

function openGoogle(lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    "_blank"
  );
}

function openWaze(lat, lng) {
  window.open(
    `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    "_blank"
  );
}

function save() {
  localStorage.setItem('ropaPlaces', JSON.stringify(places));
}