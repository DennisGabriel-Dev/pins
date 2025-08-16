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
    this.map = L.map(this.element, {
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      zoomControl: true
    }).setView([-23.5505, -46.6333], 12)

    // Tile layer simples
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map)

    setTimeout(() => this.map.invalidateSize(), 100)


    this.loadJoys()
  }

  loadJoys() {
    const url = this.joysUrlValue || "/joys.json"
    fetch(url)
      .then(r => r.json())
      .then(joys => {
        this.markers = []
        this.markerData = {}
        
        joys.forEach(j => {
          const marker = L.marker([parseFloat(j.lat), parseFloat(j.lng)], {
            title: j.body
          }).addTo(this.map)
          
          // Popup simples e funcional
          const popupContent = `
            <div style="min-width: 200px; padding: 8px;">
              <div style="font-size: 18px; margin-bottom: 8px; font-weight: bold;">
                ${j.emoji} ${this.escapeHtml(j.body)}
              </div>
              <div style="color: #666; font-size: 12px; margin-bottom: 4px;">
                📍 ${this._getLocationName(j.lat, j.lng)}
              </div>
              <div style="color: #888; font-size: 11px;">
                📅 ${new Date(j.created_at).toLocaleString('pt-BR')} • ❤️ ${j.likes_count} curtidas
              </div>
            </div>
          `
          
          marker.bindPopup(popupContent)
          
          // Evento de clique explícito
          marker.on('click', function() {
            this.openPopup()
          })
          
          this.markers.push(marker)
          this.markerData[marker._leaflet_id] = j
        })

        // Ajusta zoom se houver marcadores
        if (this.markers.length > 0) {
          const group = L.featureGroup(this.markers)
          this.map.fitBounds(group.getBounds(), { padding: [20, 20], maxZoom: 14 })
        }
      })
      .catch(() => console.warn("Falha ao carregar joys.json"))
  }

  // Método para centralizar em uma alegria específica
  centerOnJoy(joyId) {
    const marker = this.markers.find(m => this.markerData[m._leaflet_id]?.id == joyId)
    if (marker) {
      this.map.setView(marker.getLatLng(), 15, { animate: true })
      marker.openPopup()
    }
  }

  // Método para o botão "Surpresa"
  surprise() {
    if (this.markers && this.markers.length > 0) {
      const randomMarker = this.markers[Math.floor(Math.random() * this.markers.length)]
      this.map.setView(randomMarker.getLatLng(), 14, { animate: true })
      randomMarker.openPopup()
    }
  }

  _getLocationName(lat, lng) {
    return `Lat: ${parseFloat(lat).toFixed(4)}, Lng: ${parseFloat(lng).toFixed(4)}`
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