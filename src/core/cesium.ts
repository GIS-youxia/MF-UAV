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
var pauseFlag = 0;
var planeFlag = 0;
const keys: any[] = [];

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
      // Cesium.moveModels(entity);
      Cesium.mytestkey();
    });
    var ite;
    for (ite = 0; ite < 9000; ite++) {
      setTimeout(()=>{
        Cesium.moveModels(entity)
      }, 1000 + 40 * ite);
      //  setTimeout("mysql();", 10000);//mysql设置的比较慢
    }
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
        uri: '/models/ch.gltf',
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
      if (keyCode > 0 && keyCode < 256) {
        keys[keyCode] = 1;
        // tkeys[key] = timer();
        // keys0[key] = 1;
      }
    });
    document.addEventListener('keyup', (e) => {
      var key = e.keyCode;
      if (key > 0 && key < 256) {
        keys[key] = 0;
        // keys0[key] = 0;
      }
    });
  }
  static mytestkey() {
    //空格键， 暂停
    if (keys[80]) {
      pauseFlag += 1;
      if (pauseFlag > 1) {
        pauseFlag = 0;
      }
      if (pauseFlag == 0) {
        step = 0.0001;
      } else {
        step = 0;
      }
    }

    //k键，切换模型
    // if (keys[75]) {
    //   planeFlag += 1;
    //   if (planeFlag > 1) {
    //     planeFlag = 0;
    //   }
    //   replaceModel(planeFlag);
    //   resetkeys();
    // }
    //上方向键，爬升
    if (keys[38] && tempPitch < 1.57 && tempHeight < 100000) {
      tempPitch += 0.005;
      if (tempPitch > 0)
        //tempHeight += step * Math.abs(Math.sin(tempPitch)) * 1110000;//1经纬度约等于110km
        tempHeight += step * window.Math.sin(tempPitch) * 1110000; //1经纬度约等于110km
    }
    //下方向键，俯冲
    if (keys[40] && tempPitch > -1.57 && tempHeight > 500) {
      tempPitch -= 0.005;
      if (tempPitch < 0)
        //tempHeight -= step * Math.abs(Math.sin(tempPitch)) * 1110000;
        tempHeight += step * window.Math.sin(tempPitch) * 1110000;
    }

    //左方向键，左转
    if (keys[37] && tempHeading > -1.57 && tempRoll > -1.57) {
      tempHeading -= 0.005;
      if (tempRoll > -0.785) tempRoll -= 0.005;
    }
    //右方向键，右转
    if (keys[39] && tempHeading < 1.57 && tempRoll < 1.57) {
      tempHeading += 0.005;
      if (tempRoll < 0.785) tempRoll += 0.005;
      //    tempLat -= step ;
    }
    correction = window.Math.abs(window.Math.cos(tempHeading)) * window.Math.abs(window.Math.cos(tempPitch));
    //shift
    if (keys[17]) {
      tempPitch = 0;
    }

    if (window.Math.abs(tempHeading) < 0.001) tempHeading = 0;
    if (window.Math.abs(tempRoll) < 0.001) tempRoll = 0;
    if (window.Math.abs(tempPitch) < 0.001) tempPitch = 0;
    if (tempHeading > 0) tempHeading -= 0.0025;
    if (tempHeading < 0) tempHeading += 0.0025;
    if (tempRoll > 0) tempRoll -= 0.0025;
    if (tempRoll < 0) tempRoll += 0.0025;
    if (tempPitch > 0) tempPitch -= 0.0025;
    if (tempPitch < 0) tempPitch += 0.0025;
  }
}
