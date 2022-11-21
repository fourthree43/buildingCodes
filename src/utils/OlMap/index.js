/*
 * @Author: 范有度
 * @Date: 2020-12-29 09:54:32
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-03-30 16:15:39
 * @Description: openlayers地图和常用工具类
 * @FilePath: \src\utils\OlMap\index.js
 */

import {
  createLayer,
  showLayers,
  hideLayers,
  showOrHideLayers,
  getLayerByName,
} from "./Layers/index";

import {
  gcj02towgs84,
  wgs84togcj02,
  gcj02tobd09,
  bd09togcj02,
} from "./Transform/index";

exports.layersUtils = {
  createLayer,
  showLayers,
  hideLayers,
  showOrHideLayers,
  getLayerByName,
};

exports.transform = {
  gcj02towgs84,
  wgs84togcj02,
  gcj02tobd09,
  bd09togcj02,
};
