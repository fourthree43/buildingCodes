/*
 * @Author: 范有度
 * @Date: 2020-12-29 09:54:32
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-19 14:35:12
 * @Description: 初始化openlayers地图和常用工具类
 * @FilePath: \src\utils\OlMap\OLMap.js
 */
import "ol/ol.css";
import { Map, View } from "ol";
import { defaults } from "ol/control";
import * as layersUtils from "@/utils/OlMap/Layers";
// import Control from "@/utils/OlMap/Control";
import WmsLayer from "@/utils/OlMap/WmsLayer";
// import OLVector from "@/utils/OlMap/OLVector";
// import OLDrawShape from "@/utils/OlMap/OLDrawShape.js";

class OLMap {
  constructor(tpl) {
    //底图
    this.baseLayers = [];
    //地图控制
    // this.control = new Control(this);
    // // wms服务
    this.wmsLayer = new WmsLayer(this);
    // this.olVector = new OLVector(this);
    // this.olDraw = new OLDrawShape(this);

    this.initOption = {
      projection: tpl?.projection,
      ...tpl?.content?.map?.options,
    };

    // 初始化view
    const olView = new View({
        ...this.initOption,
        showFullExtent: false,
      }),
      baseLayersOption = tpl?.content?.map?.baseLayers,
      globalLayerOption = tpl?.content?.map?.globalLayer;

    this.viewer = olView;

    this.map = new Map({
      layers: [],
      target: tpl?.target,
      view: olView,
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false,
      }),
    });

    this.map.on("pointermove", (evt) => {
      this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(
        evt.pixel
      )
        ? "pointer"
        : "";
    });

    baseLayersOption.forEach((item) => {
      const ele = item,
        layer = layersUtils.createLayer(item);

      ele.viewer = this.viewer;

      this.map.addLayer(layer);
      this.baseLayers.push(layer);
    });
    globalLayerOption.forEach((item) => {
      this.wmsLayer.addLayer(item);
    });
  }
  // 获取图层信息数据
  getLayerOption(tpl) {
    return tpl?.content?.widgets.find((item) => item.id === "layer-tree");
  }
}

export default OLMap;
