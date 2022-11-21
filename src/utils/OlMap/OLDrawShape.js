/*
 * @Author: 王磊
 * @Date: 2021-01-19 10:44:30
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-09-09 10:56:40
 * @Description: openlayers 画点线面圆矩形等
 * @FilePath: \src\utils\OlMap\OLDrawShape.js
 */
import { Circle, Fill, Stroke, Style } from "ol/style";
import Draw, { createBox } from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

class DrawShape {
  constructor(props) {
    this.olmap = props;
    this.defaultStyle = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "#ff0000",
        // color: "#ffcc33",
        width: 2,
      }),
      image: new Circle({
        // 点样式
        radius: 7,
        fill: new Fill({
          color: "#ffcc33",
        }),
      }),
    });
    this.style = this.defaultStyle;
    this.zIndex = 1000;
    this.draw = null; // Draw对象
    this.geometryFunction = null; // 几何函数
    this.vectorSource = null; // 当前绘图板的source
    this.vectorLayer = null; // 当前绘图板的layer

    this.currentFeature = null;
    this.lastFeature = null;
  }

  /**
   * @author: 王磊
   * @description: 地图添加绘图交互
   * @param {String} type Point(点)/LineString(线)/Polygon(面)/Circle(圆)/Square(正方形)/Rectangle(矩形)
   * @param {Function} drawStart drawStart回调函数
   * @param {Function} drawEnd drawEnd回调函数
   * @param {Boolean} isMulti 是否同时存在多个图形
   * @return {*}
   */
  addInteractions(type, drawStart, drawEnd, { name } = {}) {
    this.lastVectorLayer = this.vectorLayer;
    this.removeInteractions();

    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.style,
      zIndex: this.zIndex,
    });
    name && this.vectorLayer.set("name", name);
    this.olmap.map.addLayer(this.vectorLayer);
    let typeVal = type;

    this.geometryFunction = null;
    if (type === "Polygon") {
      typeVal = "Polygon";
    } else if (type === "Rectangle") {
      typeVal = "Circle"; // 设置绘制类型为Circle
      this.geometryFunction = createBox();
    } else if (type === "Point") {
      typeVal = "Point";
    } else {
      this.geometryFunction = null;
    }

    this.draw = new Draw({
      source: this.vectorSource,
      type: typeVal,
      geometryFunction: this.geometryFunction,
    });

    this.olmap.map.addInteraction(this.draw);
    drawStart && this.draw.on("drawstart", drawStart);
    drawEnd && this.draw.on("drawend", drawEnd);
    return this.vectorLayer;
  }

  removeInteractions() {
    if (this.olmap.map && this.draw) {
      this.olmap.map.removeInteraction(this.draw);
      this.removeCurVecLayer();
    }
  }

  removeCurVecLayer() {
    if (this.vectorLayer) {
      this.olmap.map.removeLayer(this.vectorLayer);
    }
  }

  removeVecLayerByID(id) {
    this.vectorLayers.forEach((item) => {
      if (item.id === id) {
        this.olmap.map.removeLayer(item);
      }
    });
    this.vectorLayers = this.vectorLayers.filter((item) => item.id !== id);
  }

  // 默认移除第一个feature
  removeLastFeature() {
    const layerSource = this.vectorLayer.getSource();

    layerSource.getFeatures().forEach((ele, index) => {
      if (index === 0) {
        layerSource.removeFeature(ele);
      }
    });
  }

  // 删除所有绘制的图像
}

export default DrawShape;
