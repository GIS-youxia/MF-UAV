import * as cesium from 'cesium';
import { flightDataOptions, KeyCodeMap, KeyCodes, KeyCodesType } from '@/config/uav';
import UAVTools from '@/core/uav';

export function useUAV(viewer: cesium.Viewer, uri: string) {
  const UAV = UAVTools.loadUAVModel(viewer, uri);
  const keysMap = {
    [KeyCodeMap.UP]: false,
    [KeyCodeMap.DOWN]: false,
    [KeyCodeMap.LEFT]: false,
    [KeyCodeMap.RIGHT]: false,
    [KeyCodeMap.CONTROL]: false,
    [KeyCodeMap.STOP]: false,
  };
  //飞行姿态参数
  const data = reactive({ ...flightDataOptions });
  //飞行姿态调整
  const adjustFlightAttitude = () => {
    data.lng += data.step * data.correction;
    data.lat -= data.step * Math.sin(data.heading);
    const { lng, lat, altitude, heading, pitch, roll } = data;
    const position = cesium.Cartesian3.fromDegrees(lng, lat, altitude);
    const hpr = new cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    //@ts-ignore
    UAV.orientation = orientation;
    //@ts-ignore
    UAV.position = position;
  };
  //飞行姿态参数调整
  const adjustFlightParams = () => {
    if (keysMap[KeyCodeMap.STOP]) {
    }
    //机体爬升
    if (keysMap[KeyCodeMap.UP]) {
      data.pitch += 0.005;
      if (data.pitch > 0) {
        const { step, pitch } = data;
        //1经纬度约等于110km
        data.altitude += step * Math.sin(pitch) * 110 * 1000;
      }
    }
    //机体俯冲
    if (keysMap[KeyCodeMap.DOWN]) {
      data.pitch -= 0.005;
      if (data.pitch < 0) {
        const { step, pitch } = data;
        //1经纬度约等于110km
        data.altitude += step * Math.sin(pitch) * 110 * 1000;
      }
    }
    //机体左转
    if (keysMap[KeyCodeMap.LEFT]) {
      data.heading -= 0.005;
      if (data.roll > -0.785) {
        data.roll -= 0.005;
      }
    }
    //机体右转
    if (keysMap[KeyCodeMap.RIGHT]) {
      data.heading += 0.005;
      if (data.roll < 0.785) {
        data.roll += 0.005;
      }
    }

    const { heading, pitch, roll } = data;
    const { abs, cos } = Math;
    data.correction = abs(cos(heading) * cos(pitch));
    if (abs(heading) < 0.001) data.heading = 0;
    if (abs(roll) < 0.001) data.roll = 0;
    if (abs(pitch) < 0.001) data.pitch = 0;
    if (data.heading > 0) data.heading -= 0.0025;
    if (data.heading < 0) data.heading += 0.0025;
    if (data.roll > 0) data.roll -= 0.0025;
    if (data.roll < 0) data.roll += 0.0025;
    if (data.roll > 0) data.roll -= 0.0025;
    if (data.pitch < 0) data.pitch += 0.0025;
    if (data.pitch > 0) data.pitch -= 0.0025;
  };
  const listener = () => {
    document.addEventListener('keydown', (e) => {
      const { keyCode: code } = e;
      if (code <= 0) return void 0;
      if (code >= 256) return void 0;
      if (KeyCodes.includes(code)) {
        keysMap[code as KeyCodesType] = true;
      }
    });
    document.addEventListener('keyup', (e) => {
      const { keyCode: code } = e;
      if (code <= 0) return void 0;
      if (code >= 256) return void 0;
      if (KeyCodes.includes(code)) {
        keysMap[code as KeyCodesType] = false;
      }
    });
  };
  listener();
  //控制器初始化
  // const initControl = () => {};
  const render = () => {
    adjustFlightAttitude();
    adjustFlightParams();
    requestAnimationFrame(() => {
      render();
    });
  };
  return {
    UAV,
    data,
    render,
  };
}
