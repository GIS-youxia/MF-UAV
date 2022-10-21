<template>
  <div class="panel">
    <div v-for="(value, label) in flightParams"> {{ label }}:{{ value }} </div>
    <div class="map" ref="container"></div>
  </div>
</template>
<script setup lang="ts">
  import * as L from "leaflet"
  import "leaflet/dist/leaflet.css"
  import { useCesium } from "@/hooks/useCesium"
  import { useUav } from "@/hooks/useUav"
  import { onMounted, ref } from "vue"

  const app = document.querySelector("#app") as HTMLElement
  const { viewer } = useCesium(app)
  const { flightParams } = useUav(viewer, "/models/tb2.glb")
  const container = ref()
  onMounted(() => {
    const map = L.map(container.value).setView(
      [flightParams.lat, flightParams.lng],
      10
    )
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
    const latlngs = [[flightParams.lat, flightParams.lng]]
    setInterval(() => {
      latlngs.push([flightParams.lat, flightParams.lng])
      var polyline = L.polyline(latlngs, { color: "red" }).addTo(map)
      // map.fitBounds(polyline.getBounds())
    }, 1000)
  })
</script>
<style lang="scss" scoped>
  .panel {
    position: absolute;
    z-index: 9999;
    top: 0;
    .map {
      width: 200px;
      height: 200px;
      background-color: red;
    }
  }
</style>
