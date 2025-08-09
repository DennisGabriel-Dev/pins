import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    joysUrl: String
  }

  connect() {
    if (!window.L) {
      console.warn("Leaflet não carregado");
      return;
    }

    // Cria o mapa com opções que evitam conflito com scroll da página
    this.map = L.map(this.element, {
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      zoomControl: true,
      touchZoom: 'auto'
    }).setView([-23.5505, -46.6333], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map)

    // Garante layout correto após renderização e em resize
    setTimeout(() => this.map.invalidateSize(), 50)
    window.addEventListener('resize', () => this.map.invalidateSize())

    // Carrega alegrias e cria marcadores
    const url = this.joysUrlValue || "/joys.json"
    fetch(url)
      .then(r => r.json())
      .then(joys => {
        joys.forEach(j => {
          const marker = L.marker([parseFloat(j.lat), parseFloat(j.lng)], {
            title: j.body
          }).addTo(this.map)
          marker.bindPopup(`${j.emoji} ${this.escapeHtml(j.body)}<br/><small>${new Date(j.created_at).toLocaleString()}</small>`)
        })
      })
      .catch(() => console.warn("Falha ao carregar joys.json"))
  }

  escapeHtml(unsafe) {
    return unsafe
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }
} 