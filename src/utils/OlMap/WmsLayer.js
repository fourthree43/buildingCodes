/*
 * @Author: 周梦茹
 * @Date: 2022-01-10 15:05:36
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-19 14:47:06
 * @Description:
 * @FilePath: \src\utils\OlMap\WmsLayer.js
 */
import * as layersUtils from "@/utils/OlMap/Layers";

export default class WmsLayer {
  constructor(parent) {
    this.olmap = parent;
    this.wmsLayers = [];
  }

  // 清空所有wms相关的图层
  clearWmsLayers() {
    this.wmsLayers.forEach((layer) => {
      this.olmap.map.removeLayer(layer);
    });
    // this.wmsLayers.removeAll();
    this.wmsLayers = [];
  }

  // 创建wms服务
  addLayer(params) {
    const layer = layersUtils.createLayer(params);

    this.olmap.map.addLayer(layer);
    this.wmsLayers.push(layer);
    console.log("图层数" + this.wmsLayers.length);
  }

  // 移除指定图层
  removeSpecifiedWMS(name) {
    let delFlag = false;

    this.wmsLayers.forEach((layer) => {
      const layerType = layer?.get("name");

      if (layerType === name) {
        this.olmap.map.removeLayer(layer);
        delFlag = true;
      }
    });
    if (delFlag) {
      this.wmsLayers.splice(
        this.wmsLayers.findIndex((e) => e.get("name") === name),
        1
      );
    }
  }

  // 移除指定图层
  removeWmsLayerByTime(time) {
    let delFlag = false;

    this.wmsLayers.forEach((layer) => {
      const layerType = layer?.get("time");

      if (layerType === time) {
        this.olmap.map.removeLayer(layer);
        delFlag = true;
      }
    });
    if (delFlag) {
      this.wmsLayers.splice(
        this.wmsLayers.findIndex((e) => e.get("time") === time),
        1
      );
    }
  }

  //设置所有透明度
  setAllOpacity(value) {
    this.wmsLayers.forEach((layer) => {
      layer.setOpacity(value);
    });
  }

  // 获取所有透明度
  getAllOpacity() {
    if (this.wmsLayers.length > 0) {
      return this.wmsLayers[0].getOpacity();
    }
    return 1;
  }
}
