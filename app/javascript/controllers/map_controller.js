import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static values = { joysUrl: String }

  connect() {
    if (!window.L) return;

    this.map = L.map(this.element, {
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      zoomControl: true
    }).setView([-23.5505, -46.6333], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map)

    setTimeout(() => this.map.invalidateSize(), 100)
    this.loadJoys()
    
    // Expõe o controller globalmente para acesso externo
    window.mapController = this
    
    // Função global para centralizar em uma alegria
    window.centerOnJoy = (joyId) => {
      this.centerOnJoy(joyId)
    }
  }

  loadJoys(url = null) {
    const fetchUrl = url || this.joysUrlValue || "/joys.json"
    
    return fetch(fetchUrl)
      .then(r => r.json())
      .then(joys => {
        // Remove marcadores existentes
        if (this.markers) {
          this.markers.forEach(marker => this.map.removeLayer(marker))
        }
        
        this.markers = []
        this.markerData = {}
        
        joys.forEach(j => {
          const marker = L.marker([parseFloat(j.lat), parseFloat(j.lng)], {
            title: j.body
          }).addTo(this.map)
          
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
        } else {
          // Se não há marcadores, volta para vista padrão
          this.map.setView([-23.5505, -46.6333], 12)
        }
        
        return joys; // Retorna os joys para permitir encadeamento
      })
      .catch(() => {
        console.warn("Falha ao carregar joys.json");
        return []; // Retorna array vazio em caso de erro
      })
  }

  centerOnJoy(joyId) {
    console.log('centerOnJoy chamado com joyId:', joyId);
    console.log('Tipo do joyId:', typeof joyId);
    
    // Remove seleção anterior (volta todos para azul)
    if (this.markers) {
      this.markers.forEach(m => {
        const icon = m.getElement()
        if (icon) {
          icon.style.filter = ''
        }
      })
    }
    
    // Procura o marker pelo ID do joy (não pelo _leaflet_id)
    const marker = this.markers.find(m => {
      const joyData = this.markerData[m._leaflet_id];
      return joyData && joyData.id == joyId;
    });
    
    if (marker) {
      // Zoom mais próximo para destacar o pin
      this.map.setView(marker.getLatLng(), 12, { animate: true })
      
      // Faz o pin selecionado ficar vermelho
      const icon = marker.getElement()
      if (icon) {
        icon.style.filter = 'hue-rotate(180deg) saturate(2) brightness(1.2)'
      }
      
      // Abre o popup
      marker.openPopup()
    } else {
      console.log('Marker não encontrado para joyId:', joyId);
      console.log('Markers disponíveis:', this.markers.length);
      console.log('MarkerData:', this.markerData);
      
      // Debug: mostra todos os IDs disponíveis
      const availableIds = Object.values(this.markerData).map(joy => joy.id);
      console.log('IDs disponíveis:', availableIds);
      
      // Tenta encontrar por lat/lng se tiver os dados do joy
      if (window.lastCreatedJoy && window.lastCreatedJoy.id == joyId) {
        console.log('Tentando encontrar por coordenadas:', window.lastCreatedJoy.lat, window.lastCreatedJoy.lng);
        const markerByCoords = this.markers.find(m => {
          const latLng = m.getLatLng();
          return Math.abs(latLng.lat - parseFloat(window.lastCreatedJoy.lat)) < 0.001 &&
                 Math.abs(latLng.lng - parseFloat(window.lastCreatedJoy.lng)) < 0.001;
        });
        
        if (markerByCoords) {
          console.log('Encontrado por coordenadas!');
          this.map.setView(markerByCoords.getLatLng(), 12, { animate: true });
          const icon = markerByCoords.getElement();
          if (icon) {
            icon.style.filter = 'hue-rotate(180deg) saturate(2) brightness(1.2)';
          }
          markerByCoords.openPopup();
        }
      }
    }
  }

  addJoyToMap(joy) {
    console.log('addJoyToMap chamado com joy:', joy.id);
    
    // Verifica se o joy já existe
    const existingMarker = this.markers.find(m => {
      const joyData = this.markerData[m._leaflet_id];
      return joyData && joyData.id == joy.id;
    });
    
    if (existingMarker) {
      console.log('Joy já existe no mapa:', joy.id);
      return existingMarker;
    }
    
    const marker = L.marker([parseFloat(joy.lat), parseFloat(joy.lng)], {
      title: joy.body
    }).addTo(this.map)
    
    const popupContent = `
      <div style="min-width: 200px; padding: 8px;">
        <div style="font-size: 18px; margin-bottom: 8px; font-weight: bold;">
          ${joy.emoji} ${this.escapeHtml(joy.body)}
        </div>
        <div style="color: #666; font-size: 12px; margin-bottom: 4px;">
          📍 ${this._getLocationName(joy.lat, joy.lng)}
        </div>
        <div style="color: #888; font-size: 11px;">
          📅 ${new Date(joy.created_at).toLocaleString('pt-BR')} • ❤️ ${joy.likes_count} curtidas
        </div>
      </div>
    `
    
    marker.bindPopup(popupContent)
    
    // Evento de clique explícito
    marker.on('click', function() {
      this.openPopup()
    })
    
    // Adiciona ao array de markers
    this.markers.push(marker)
    
    // Adiciona ao markerData com o _leaflet_id
    this.markerData[marker._leaflet_id] = joy
    
    console.log('Marker adicionado. Total de markers:', this.markers.length);
    console.log('MarkerData atualizado. Keys:', Object.keys(this.markerData));
    console.log('Último marker _leaflet_id:', marker._leaflet_id);
    console.log('Último marker joy ID:', joy.id);
    
    // Faz o mapa pulsar
    this.pulseMap()
    
    return marker
  }

  pulseMap() {
    const mapElement = this.map.getContainer()
    mapElement.classList.add('map-pulse')
    setTimeout(() => {
      mapElement.classList.remove('map-pulse')
    }, 1000)
  }

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