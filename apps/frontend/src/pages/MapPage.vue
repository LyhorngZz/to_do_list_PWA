<script setup lang="ts">
import { ref } from 'vue'

import BaseMap from '@/components/map/BaseMap.vue'
import PlaceDetail from '@/components/map/PlaceDetail.vue'

import type { MapPlace } from '@/types/map.types'

const selectedPlace = ref<MapPlace | null>(null)

const handlePlaceSelected = (place: MapPlace) => {
  selectedPlace.value = place
}
</script>

<template>
  <div class="map-page">
    <div class="map-wrapper">
      <BaseMap
        @place-selected="handlePlaceSelected"
      />
    </div>

    <PlaceDetail
      v-if="selectedPlace"
      :place="selectedPlace"
      class="place-panel"
    />
  </div>
</template>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map-wrapper {
  width: 100%;
  height: 100%;
}

.place-panel {
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 10;

  width: 300px;
}
</style>