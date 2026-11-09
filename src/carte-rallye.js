let carte = null
let marqueurPosition = null

const lieuxRallye = [
  { numero: 1, nom: "Office de tourisme Saint-Martin", lat: 46.205735, lng: -1.365491 },
  { numero: 2, nom: "Citadelle Vauban", lat: 46.204928, lng: -1.358847 },
  { numero: 3, nom: "Porte de Toiras", lat: 46.200413, lng: -1.361900 },
  { numero: 4, nom: "Gendarmerie", lat: 46.193706, lng: -1.356675 },
  { numero: 5, nom: "Moulin de Bellère", lat: 46.193460, lng: -1.370209 },
  { numero: 6, nom: "Église du Bois-Plage", lat: 46.185275, lng: -1.392716 },
  { numero: 7, nom: "Église de La Couarde", lat: 46.194149, lng: -1.424486 },
  { numero: 8, nom: "Marais salants de Loix", lat: 46.208995, lng: -1.450798 },
  { numero: 9, nom: "Pick-Sel", lat: 46.211036, lng: -1.439911 },
  { numero: 10, nom: "Moulin à marée de Loix", lat: 46.215955, lng: -1.439300 },
  { numero: 11, nom: "Bassin du Goisil", lat: 46.193310, lng: -1.437285 },
  { numero: 12, nom: "Réostréa", lat: 46.204644, lng: -1.381815 },
  { numero: 13, nom: "Rue Mérindot – Maison de la Vinaterie", lat: 46.203004, lng: -1.369752 },
  { numero: 14, nom: "Église Saint-Martin", lat: 46.203148, lng: -1.368377 },
  { numero: 15, nom: "Port de Saint-Martin", lat: 46.206432, lng: -1.367857 },
  { numero: 16, nom: "Office de tourisme – arrivée", lat: 46.205735, lng: -1.365491 }
]

export function initialiserCarteRallye() {
  const conteneur = document.getElementById("carte-rallye")

  if (!conteneur || !window.L) return

  if (carte) {
    carte.invalidateSize()
    return
  }

  carte = L.map(conteneur).setView([46.205, -1.400], 12)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap'
  }).addTo(carte)

  const points = []

  lieuxRallye.forEach(lieu => {
    const marqueur = L.marker([lieu.lat, lieu.lng]).addTo(carte)

    marqueur.bindPopup(
      `<strong>Étape ${lieu.numero}</strong><br>${lieu.nom}`
    )

    points.push([lieu.lat, lieu.lng])
  })

  L.polyline(points, {
    color: "#174D36",
    weight: 4,
    opacity: 0.8,
    dashArray: "8, 8"
  }).addTo(carte)

  carte.fitBounds(points, { padding: [25, 25] })
}

export function actualiserPositionCarte(latitude, longitude) {
  if (!carte) return

  const position = [latitude, longitude]

  if (!marqueurPosition) {
    marqueurPosition = L.circleMarker(position, {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: "#2678d4",
      fillOpacity: 1
    }).addTo(carte)

    marqueurPosition.bindPopup("Votre position")
  } else {
    marqueurPosition.setLatLng(position)
  }
}