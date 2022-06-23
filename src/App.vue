<template>
  <div ref="containerRef"></div>
</template>
<script setup lang="ts">
import { useCesium } from "@/hooks/useCesium"
import { useUAV } from "@/hooks/useUAV";
const element = document.querySelector("#app") as HTMLElement
const { viewer } = useCesium(element)
const { render} = useUAV(viewer, "/models/tb2.glb")
render()
</script>
