<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default Leaflet marker icons in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps({
  locations: {
    type: Array,
    default: () => [],
  },
  zoom: {
    type: Number,
    default: 7,
  },
  height: {
    type: String,
    default: '450px',
  },
})

const mapElement = ref(null)

let map = null
let markerLayer = null
let resizeObserver = null

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const validLocations = () => {
  return props.locations.filter(location => {
    const latitude = Number(location.latitude)
    const longitude = Number(location.longitude)

    return (
      location.latitude !== null &&
      location.latitude !== '' &&
      location.longitude !== null &&
      location.longitude !== '' &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    )
  })
}

const updateMarkers = () => {
  if (!map || !markerLayer) return

  markerLayer.clearLayers()

  const locations = validLocations()

  locations.forEach(location => {
    const marker = L.marker(
      [Number(location.latitude), Number(location.longitude)],
      { icon: defaultIcon }
    )

    const popupContent = document.createElement('div')
    const title = document.createElement('strong')
    title.textContent = location.name || 'Destination'

    popupContent.appendChild(title)

    if (location.description) {
      const description = document.createElement('p')
      description.textContent = location.description
      popupContent.appendChild(description)
    }

    marker.bindPopup(popupContent)
    marker.addTo(markerLayer)
  })

  if (locations.length === 1) {
    map.setView(
      [
        Number(locations[0].latitude),
        Number(locations[0].longitude),
      ],
      props.zoom
    )
  } else if (locations.length > 1) {
    const bounds = L.latLngBounds(
      locations.map(location => [
        Number(location.latitude),
        Number(location.longitude),
      ])
    )

    map.fitBounds(bounds, { padding: [35, 35], maxZoom: props.zoom })
  }
}

onMounted(async () => {
  await nextTick()

  if (!mapElement.value) return

  map = L.map(mapElement.value, {
  scrollWheelZoom: false,
}).setView([28.3949, 84.1240], props.zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)

  updateMarkers()

  resizeObserver = new ResizeObserver(() => {
  map?.invalidateSize()
})

resizeObserver.observe(mapElement.value)
})

watch(
  () => props.locations,
  () => updateMarkers(),
  { deep: true }
)
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (map) {
    map.remove()
    map = null
    markerLayer = null
  }
})
</script>

<template>
  <div
    ref="mapElement"
    class="w-full overflow-hidden rounded-2xl border border-[#e7e3da] z-0"
    :style="{ height }"
  ></div>
</template>
