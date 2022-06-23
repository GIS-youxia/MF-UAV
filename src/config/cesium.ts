import { Viewer } from 'cesium';

export const viewerOptions: Viewer.ConstructorOptions = {
  infoBox: false, //是否显示信息框
  selectionIndicator: false, //是否显示选取指示器组件
  shouldAnimate: false,
  animation: false, //是否创建动画小器件，左下角仪表
  baseLayerPicker: false, //地图切换控件(底图以及地形图)是否显示,默认显示true
  geocoder: false, //地图查找
  navigationHelpButton: false, //帮助按钮
  fullscreenButton: false, //全屏按钮
  homeButton: false, //主页按钮
  sceneModePicker: false, //场景模式选择器
  timeline: false, //时间线
  shadows: false, //阴影
};
