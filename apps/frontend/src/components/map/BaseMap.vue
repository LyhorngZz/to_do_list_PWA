<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { useMap } from '@/composables/map/useMap'
import type { MapPlace } from '@/types/map.types'

const emit = defineEmits<{
  placeSelected: [place: MapPlace]
}>()

const mapContainer = ref<HTMLElement | null>(null)

const { map, initializeMap, destroyMap } = useMap()

let marker: maplibregl.Marker | null = null

onMounted(() => {
  if (!mapContainer.value) {
    return
  }

  initializeMap(mapContainer.value)

  map.value?.on('click', (event) => {
    const { lng, lat } = event.lngLat

    marker?.remove()

    marker = new maplibregl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.value!)

    emit('placeSelected', {
      coordinate: {
        latitude: lat,
        longitude: lng,
      },
    })
  })
})

onBeforeUnmount(() => {
  marker?.remove()
  destroyMap()
})
</script>

<template>
  <div
    ref="mapContainer"
    class="map-container"
  />
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>