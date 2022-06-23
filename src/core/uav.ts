import * as cesium from 'cesium';
import { UAVOptions } from '@/config/uav';
class UAV {
  static loadUAVModel(viewer: cesium.Viewer, uri: string) {
    const position = cesium.Cartesian3.fromDegrees(...UAVOptions.position);
    const hpr = new cesium.HeadingPitchRoll();
    const orientation = cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    const entity = viewer.entities.add({
      name: 'uax',
      position,
      //@ts-ignore
      orientation: orientation,
      model: {
        uri,
        minimumPixelSize: 128,
        maximumScale: 20000,
        runAnimations: true,
      },
    });
    viewer.trackedEntity = entity;
    return entity;
  }
}

export default UAV;
