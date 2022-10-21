import { reactive, shallowReactive } from "vue"
import * as cesium from "cesium"

export function useUav(viewer: cesium.Viewer, uri: string) {
  const DIRECTION_ENUM = {
    UP: "w",
    DOWN: "s",
    LEFT: "a",
    RIGHT: "d",
    SPEED_UP: "q",
    SPEED_DOWN: "e",
  }
  const keysMap = {
    [DIRECTION_ENUM.UP]: false,
    [DIRECTION_ENUM.DOWN]: false,
    [DIRECTION_ENUM.LEFT]: false,
    [DIRECTION_ENUM.RIGHT]: false,
    [DIRECTION_ENUM.SPEED_UP]: false,
    [DIRECTION_ENUM.SPEED_DOWN]: false,
  }
  const flightParams = reactive<FlightParamsType>({
    lat: 30,
    lng: 120,
    altitude: 2000,
    heading: 0,
    pitch: 0,
    roll: 0,
    correction: 1,
    speed: 1224,
  })
  //加载飞行器模型
  const lodaFlightModel = () => {
    const position = cesium.Cartesian3.fromDegrees(120, 30, 2000)
    const hpr = new cesium.HeadingPitchRoll()
    const orientation = cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    )
    const model = viewer.entities.add({
      name: "uax",
      position,
      //@ts-ignore
      orientation: orientation,
      model: {
        uri,
        minimumPixelSize: 128,
        maximumScale: 20000,
        runAnimations: true,
      },
    })
    //   viewer.clockViewModel.shouldAnimate = false;
    viewer.trackedEntity = model
    return model
  }
  const model = lodaFlightModel()
  //开启按键监听(这一步缓存按键信息, 而不是直接调整姿态为了支持长按和姿态调整过渡的平顺)
  const openKeysListener = () => {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (Object.keys(keysMap).includes(e.key)) keysMap[e.key] = true
    })
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (Object.keys(keysMap).includes(e.key)) keysMap[e.key] = false
    })
  }
  const adjustFlightAttitude = () => {
    const temp = flightParams.speed / 60 / 60 / 60 / 110
    flightParams.lng += temp * Math.cos(flightParams.heading)
    flightParams.lat -= temp * Math.sin(flightParams.heading)
    const { lng, lat, altitude, heading, pitch, roll } = flightParams
    flightParams.altitude += temp * Math.sin(pitch) * 110 * 1000 * 10
    const position = cesium.Cartesian3.fromDegrees(lng, lat, altitude)
    // const position = viewer.scene.clampToHeight(
    //   cesium.Cartesian3.fromDegrees(lng, lat, altitude),
    //   [model]
    // )
    const hpr = new cesium.HeadingPitchRoll(heading, pitch, roll)
    const orientation = cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    )

    //@ts-ignore
    model.orientation = orientation
    //@ts-ignore
    model.position = position
  }
  const adjustFlightParams = () => {
    if (keysMap[DIRECTION_ENUM.SPEED_UP]) {
      flightParams.speed += 100
    }
    if (keysMap[DIRECTION_ENUM.SPEED_DOWN]) {
      if (flightParams.speed >= 500) {
        flightParams.speed -= 100
      }
    }

    //机体爬升
    if (keysMap[DIRECTION_ENUM.UP] && flightParams.pitch <= 0.3) {
      flightParams.pitch += 0.005
      if (flightParams.pitch > 0) {
        const { speed, pitch } = flightParams
        const temp = (flightParams.speed / 60 / 60 / 60) * 110
        //1经纬度约等于110km
        flightParams.altitude += temp * Math.sin(pitch)
      }
    }
    //机体俯冲
    if (keysMap[DIRECTION_ENUM.DOWN] && flightParams.pitch >= -0.3) {
      flightParams.pitch -= 0.01
      if (flightParams.pitch < 0) {
        const { speed, pitch } = flightParams
        //1经纬度约等于110km
        const temp = (flightParams.speed / 60 / 60 / 60) * 110
        flightParams.altitude += temp * Math.sin(pitch)
      }
    }
    //机体左转
    if (keysMap[DIRECTION_ENUM.LEFT]) {
      flightParams.heading -= 0.005
      if (flightParams.roll > -0.785) {
        flightParams.roll -= 0.005
      }
    }
    //机体右转
    if (keysMap[DIRECTION_ENUM.RIGHT]) {
      flightParams.heading += 0.005
      if (flightParams.roll < 0.785) {
        flightParams.roll += 0.005
      }
    }

    const { heading, pitch, roll } = flightParams
    const { abs, cos } = Math
    flightParams.correction = abs(cos(heading) * cos(pitch))
    if (abs(heading) < 0.001) flightParams.heading = 0
    if (abs(roll) < 0.001) flightParams.roll = 0
    if (abs(pitch) < 0.001) flightParams.pitch = 0

    //方向自动回正
    // if (flightParams.heading > 0) flightParams.heading -= 0.0025
    // if (flightParams.heading < 0) flightParams.heading += 0.0025
    if (flightParams.roll > 0) flightParams.roll -= 0.003
    if (flightParams.roll < 0) flightParams.roll += 0.003
    if (flightParams.pitch < 0) flightParams.pitch += 0.005
    if (flightParams.pitch > 0) flightParams.pitch -= 0.003
  }
  const renderer = () => {
    adjustFlightParams()
    adjustFlightAttitude()
    requestAnimationFrame(renderer)
  }
  renderer()
  openKeysListener()
  return {
    flightParams,
  }
}

export type FlightParamsType = {
  lat: number
  lng: number
  altitude: number
  heading: number
  pitch: number
  roll: number
  correction: number
  speed: number
}
