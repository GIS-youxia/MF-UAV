export const UAVOptions = {
  position: [120, 30, 2000] as [number, number, number],
};

export const flightDataOptions = {
  lat: UAVOptions.position[1],
  lng: UAVOptions.position[0],
  altitude: UAVOptions.position[2], //海拔
  heading: 0, //绕负Z轴的旋转(航向)
  pitch: 0, //绕负y轴的旋转(俯仰)
  roll: 0, //绕正x轴的旋转(横滚)
  correction: 1, //飞行姿态对飞行速度的修正量
  step: 0.0001, //每次调整单位
} as {
  lat: number;
  lng: number;
  altitude: number;
  heading: number;
  pitch: number;
  roll: number;
  correction: number;
  step: number;
};

export enum KeyCodeMap {
  'STOP' = 80,
  'UP' = 38,
  'DOWN' = 40,
  'LEFT' = 37,
  'RIGHT' = 39,
  'CONTROL' = 17,
  map,
}
export const KeyCodes = [
  KeyCodeMap.STOP,
  KeyCodeMap.UP,
  KeyCodeMap.DOWN,
  KeyCodeMap.LEFT,
  KeyCodeMap.RIGHT,
  KeyCodeMap.CONTROL,
] as const;

export type KeyCodesType = 80 | 38 | 40 | 37 | 39 | 17;
