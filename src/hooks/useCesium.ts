import * as cesium from "cesium"

cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
export const options: cesium.Viewer.ConstructorOptions = {
  infoBox: false, //是否显示信息框
  selectionIndicator: false, //是否显示选取指示器组件
  animation: false, //是否创建动画小器件，左下角仪表
  baseLayerPicker: false, //地图切换控件(底图以及地形图)是否显示,默认显示true
  geocoder: false, //地图查找
  navigationHelpButton: false, //帮助按钮
  fullscreenButton: false, //全屏按钮
  homeButton: false, //主页按钮
  sceneModePicker: false, //场景模式选择器
  timeline: false, //时间线
  shadows: false, //阴影
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
