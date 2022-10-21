<template>
  <div class="control">
    <BaseFlightParams :data="flightParams" />
    <BaseMapPreview :data="flightParams" />
    <BaseTutorial />
  </div>
</template>
<script setup lang="ts">
  import BaseMapPreview from "@/components/BaseMapPreview.vue"
  import BaseFlightParams from "@/components/BaseFlightParams.vue"
  import BaseTutorial from "@/components/BaseTutorial.vue"
  import { useCesium } from "@/hooks/useCesium"
  import { useUav } from "@/hooks/useUav"
  import { onMounted, ref } from "vue"

  const app = document.querySelector("#app") as HTMLElement
  const { viewer } = useCesium(app)
  const { flightParams } = useUav(
    viewer,
    `${import.meta.env.VITE_API_DOMAIN}/models/tb2.glb`
  )
  alert(import.meta.env.VITE_API_DOMAIN)
  // const container = ref()wa
</script>
<style lang="scss" scoped>
  .control {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 9999;
    display: grid;
    grid-gap: 10px;
  }
</style>
