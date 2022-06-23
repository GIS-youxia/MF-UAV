<template>
  <div ref="containerRef"></div>
</template>
<script setup lang="ts">
import { Cesium } from "@/core/cesium";
const viewr = Cesium.initViewer()

const uav = Cesium.addModels(viewr)
Cesium.animation(viewr,uav)
Cesium.bindEvent()


// import { Viewer } from 'cesium';
</script>
<style>
* {
  padding: 0;
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
