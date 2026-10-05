<script setup>
import {
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch
} from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const locationIcon = L.icon({
    iconUrl: '/icons/location.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
})

const props = defineProps({
    location: {
        type: Object,
        required: true
    }
})

const mapElement = ref(null)

let map = null
let marker = null
let accuracyCircle = null

function renderLocation() {
    if (!map || !props.location) return

    const point = [
        props.location.latitude,
        props.location.longitude
    ]

    map.setView(point, 17)

    if (marker) {
        marker.remove()
    }

    if (accuracyCircle) {
        accuracyCircle.remove()
    }

    marker = L.marker(point, {
        icon: locationIcon
    }).addTo(map)

    if (props.location.label) {
        marker
            .bindPopup(props.location.label)
            .openPopup()
    }

    if (props.location.accuracy > 0) {
        accuracyCircle = L.circle(point, {
            radius: props.location.accuracy,
            color: '#0C2645',
            fillColor: '#0C2645',
            fillOpacity: 0.12
        }).addTo(map)
    }

    nextTick(() => {
        map.invalidateSize()
    })
}

onMounted(() => {
    map = L.map(mapElement.value).setView(
        [0, 0],
        2
    )

    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(map)

    renderLocation()
})

watch(
    () => props.location,
    renderLocation,
    { deep: true }
)

onBeforeUnmount(() => {
    map?.remove()
})
</script>

<template>
    <div
        ref="mapElement"
        class="location-map"
        aria-label="Mapa da localização"
    />
</template>

<style scoped>
.location-map {
    width: 100%;
    height: 240px;
    margin-top: 12px;
    border-radius: 8px;
    overflow: hidden;
}
</style>