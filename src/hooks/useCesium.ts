import * as cesium from "cesium"

cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
export const options: cesium.Viewer.ConstructorOptions = {
  infoBox: false,
  selectionIndicator: false,
  animation: false,
  baseLayerPicker: false,
  geocoder: false,
  navigationHelpButton: false,
  fullscreenButton: false,
  homeButton: false,
  sceneModePicker: false,
  timeline: false,
  shadows: true,
  shouldAnimate: true,
}

export function useCesium(element: HTMLElement) {
  const viewer = new cesium.Viewer(element, {
    ...options,
    terrainProvider: cesium.createWorldTerrain(),
  })
  viewer.scene.globe.depthTestAgainstTerrain = true
  //清除版权信息
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = "none"
  return { viewer }
}
