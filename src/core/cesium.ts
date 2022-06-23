import { Viewer, Cartesian3, HeadingPitchRoll, Transforms, Ellipsoid, Math, Entity } from 'cesium';
import { viewerOptions } from '@/config/index';

var lat = 18.5;
var lng = 109;
var height = 2000.0;
var heading = 0;
var pitch = 0;
var roll = 0;
var step = 0.0001;
//定义飞行过程中的六自由度参数,飞行过程中，参数实时更新，经度，维度，高度，偏航角，俯仰角，滚转角
var tempLng: number;
var tempLat: number;
var temp;
var tempHeight: number | undefined;
var tempHeading: number;
var tempPitch: number | undefined;
var tempRoll: number | undefined;
//左右和上下移动时对速度有影响，用correction去修正速度
var correction = 1;

//全局实体
var myEntity, myEntity2, myCesium, myViewer;
var msg = [1000000];
//全局步长参数
var step = 0.0001;

//全局变量标识
//停止飞行变量和飞机模型变量
var pauseFlag = 0,
  planeFlag = 0;

export class Cesium {
  static initViewer() {
    const viewer = new Viewer('app', viewerOptions);
    const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
    creditContainer.style.display = 'none';
    return viewer;
  }
  static animation(viewer: Viewer, entity: Entity) {
    // console.log(viewer.creditContainer)
    viewer.clock.onTick.addEventListener((clock) => {
      Cesium.moveModels(entity);
    });
  }
  static addModels(viewer: Viewer) {
    const position = Cartesian3.fromDegrees(lng, lat, height);
    const hpr = new HeadingPitchRoll(heading, pitch, roll);
    const orientation = Transforms.headingPitchRollQuaternion(position, hpr);
    var entity = viewer.entities.add({
      name: 'uax',
      position: position,
      //@ts-ignore
      orientation: orientation,
      model: {
        uri: '/models/tb2.glb',
        minimumPixelSize: 128,
        maximumScale: 20000,
        runAnimations: true,
      },
    });
    viewer.trackedEntity = entity;
    tempLng = lng;
    tempLat = lat;
    tempHeight = height;
    tempHeading = heading;
    tempPitch = pitch;
    tempRoll = roll;
    return entity;
  }

  static moveModels(entity: Entity) {
    tempLng += step * correction;
    tempLat -= step * window.Math.sin(tempHeading); //主要用来左右移动
    var position = Cartesian3.fromDegrees(tempLng, tempLat, tempHeight);
    var hpr = new HeadingPitchRoll(tempHeading, tempPitch, tempRoll);
    // var wgs84 = Ellipsoid.WGS84.cartesianToCartographic(position);
    var orientation = Transforms.headingPitchRollQuaternion(position, hpr);
    //@ts-ignore
    entity.orientation = orientation;
    //@ts-ignore
    entity.position = position;
  }
  static bindEvent() {
    document.addEventListener('keydown', (e) => {
      const { keyCode } = e;
      console.log(keyCode);
      // console.log(e.keyCode)
      if (keyCode === 37 && tempHeading > -1.57 && tempRoll > -1.57) {
        tempHeading -= 0.005;
        if (tempRoll > -0.785) tempRoll -= 0.005;
      }
      if (keyCode === 39 && tempHeading < 1.57 && tempRoll < 1.57) {
        tempHeading += 0.005;
        if (tempRoll < 0.785) tempRoll += 0.005;
      }
      correction = window.Math.abs(window.Math.cos(tempHeading)) * window.Math.abs(window.Math.cos(tempPitch));
      // console.log()
    });
  }
}
