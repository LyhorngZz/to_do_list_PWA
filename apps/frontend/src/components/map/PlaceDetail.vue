<script setup lang="ts">
import type { MapPlace } from '@/types/map.types'

defineProps<{
  place: MapPlace
}>()
</script>

<template>
  <div class="place-detail">
    <h2>
      {{ place.name ?? 'Selected Location' }}
    </h2>

    <p v-if="place.type">
      Type: {{ place.type }}
    </p>

    <p>
      Latitude:
      {{ place.coordinate.latitude.toFixed(6) }}
    </p>

    <p>
      Longitude:
      {{ place.coordinate.longitude.toFixed(6) }}
    </p>
  </div>
</template>

<style scoped>
.place-detail {
  padding: 16px;
  background: white;
  border-radius: 12px;
}
</style>