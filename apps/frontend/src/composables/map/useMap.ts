import { shallowRef } from 'vue'
import maplibregl from 'maplibre-gl'

export function useMap() {
  const map = shallowRef<maplibregl.Map | null>(null)

  const initializeMap = (container: HTMLElement) => {
    map.value = new maplibregl.Map({
      container,

      style: 'https://demotiles.maplibre.org/style.json',

      center: [104.9282, 11.5564],

      zoom: 12,
    })

    map.value.addControl(
      new maplibregl.NavigationControl(),
      'top-right',
    )
  }

  const destroyMap = () => {
    map.value?.remove()
    map.value = null
  }

  return {
    map,
    initializeMap,
    destroyMap,
  }
}