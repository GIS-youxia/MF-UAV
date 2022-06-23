import * as cesium from 'cesium';
import { viewerOptions } from '@/config/index';

export function useCesium(element: HTMLElement) {
  const initViewer = (element: HTMLElement): cesium.Viewer => {
    const _viewer = new cesium.Viewer(element, viewerOptions);
    //清除版权信息
    const creditContainer = _viewer.cesiumWidget.creditContainer as HTMLElement;
    creditContainer.style.display = 'none';
    return _viewer;
  };
  const viewer: cesium.Viewer = initViewer(element);
  return { viewer };
}
