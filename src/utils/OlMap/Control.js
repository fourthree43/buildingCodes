import * as layersUtils from "@/utils/OlMap/Layers";
import Measure from "@/utils/OlMap/Measure/measure";
import OLDrawShape from "@/utils/OlMap/OLDrawShape";

class Control {
  constructor(parent) {
    this.olmap = parent;
    // 测距和侧面
    this.measure = new Measure(parent);
    // 绘图
    this.drawShape = new OLDrawShape(parent);
  }

  // 底图切换
  switchBaseMap(select) {
    layersUtils.showOrHideLayers(this.olmap.baseLayers, "group", select);
  }

  // 放大
  mapZoomIn() {
    let zoom = this.olmap.viewer.getZoom();

    if (zoom < 20) {
      zoom++;
      this.olmap.viewer.setZoom(zoom);
    }
  }

  //缩小
  mapZoomOut() {
    let zoom = this.olmap.viewer.getZoom();

    if (zoom > 1) {
      zoom--;
      this.olmap.viewer.setZoom(zoom);
    }
  }
  //恢复初始化
  recovery() {
    this.olmap.viewer.setZoom(this.olmap.initOption.zoom);
    this.olmap.viewer.setCenter(this.olmap.initOption.center);
  }
}
export default Control;
