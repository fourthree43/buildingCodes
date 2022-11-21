/*
 * @Author: 范有度
 * @Date: 2020-12-29 09:54:32
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-19 14:26:58
 * @Description: openlayers地图和常用工具类
 * @FilePath: \src\utils\OlMap\Layers\index.js
 */

import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style"; // Stroke, Fill;
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
// import { request as axios } from "@/utils/config/http.js";
import { toSize } from "ol/size";
import Overlay from "ol/Overlay";
// import GeoJSON from "ol/format/GeoJSON";
import TilegridWMTS from "ol/tilegrid/WMTS";
import ImageWMTS from "ol/source/WMTS";
import { getTopLeft } from "ol/extent";
import { get } from "ol/proj";

/**
 * 高亮设置
 * @type {string}
 */
// const HIGH_LIGHT_LAYER = "highLightLayer",
//   HIGH_LIGHT_STYLE_FILL = {
//     // color: 'rgba(103,222,248,0.8)'
//     color: "rgba(103,222,248,1)",
//   },
//   HIGH_LIGHT_STYLE_STROKE = {
//     color: "#FF0000",
//     // lineDash: [20,10],
//     width: 4,
//   };

let highLightLayer = null;

/**
 * @description 处理issue，从202012111200格式化成2020-10-11T00:00:00.004Z
 * @param {String} cycle 周期编码
 * @param {*} issue 时间 202012111200
 */
// function getGeoTime(cycle, issue) {
//   const copyIssue = issue;

//   let cycleCode,
//     result = null;

//   if (copyIssue) {
//     switch (cycle) {
//       case "normal":
//         cycleCode = "000";
//         break;
//       case "COOH":
//         cycleCode = "001";
//         break;
//       case "COOD":
//         cycleCode = "002";
//         break;
//       case "COAW":
//         cycleCode = "003";
//         break;
//       case "COTD":
//         cycleCode = "004";
//         break;
//       case "COAM":
//         cycleCode = "005";
//         break;
//       case "COAQ":
//         cycleCode = "006";
//         break;
//       case "COAY":
//         cycleCode = "007";
//         break;
//       case "COED":
//         cycleCode = "008";
//         break;
//       default:
//         return "000";
//     }

//     const year = copyIssue.substr(0, 4) || "0000",
//       month = copyIssue.substr(4, 2) || "00",
//       day = copyIssue.substr(6, 2) || "00",
//       hour = copyIssue.substr(8, 2) || "00",
//       minute = copyIssue.substr(10, 2) || "00",
//       second = copyIssue.substr(12, 2) || "00";

//     result = `${year}-${month}-${day}T${hour}:${minute}:${second}.${cycleCode}Z`;
//   }
//   return result;
// }

// function to16(color) {
//   const r = parseInt(color[0], 10),
//     g = parseInt(color[1], 10),
//     b = parseInt(color[2], 10),
//     // eslint-disable-next-line no-bitwise
//     hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

//   return hex;
// }

// // 获取sld xml
// function getStyle(colorValue, mark) {
//   if (!colorValue) {
//     return "";
//   }
//   const colors = [],
//     { reMaps } = colorValue;

//   reMaps.forEach((item) => {
//     colors.push({
//       color: item.color && to16(item.color),
//       value: parseFloat(item.value),
//       opacity: item.color && item.color[3],
//     });
//   });

//   let colorsString = "";

//   colors.forEach((item) => {
//     colorsString += `<ColorMapEntry color="${item.color}" quantity="${item.value}" opacity="${item.opacity}"/>`;
//   });

//   const result = `<?xml version="1.0" encoding="UTF-8"?>
//     <StyledLayerDescriptor
//       xmlns="http://www.opengis.net/sld"
//       xmlns:ogc="http://www.opengis.net/ogc"
//       xmlns:xlink="http://www.w3.org/1999/xlink"
//       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//       xsi:schemaLocation="http://www.opengis.net/sld
//       http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
//       version="1.0.0"
//     >
//       <NamedLayer>
//         <Name>${mark}</Name>
//         <UserStyle>
//           <Title>A raster style</Title>
//           <FeatureTypeStyle>
//             <Rule>
//               <RasterSymbolizer>
//                 <Opacity>1.0</Opacity>
//                 <ColorMap type="intervals">
//                   ${colorsString}
//                 </ColorMap>
//               </RasterSymbolizer>
//             </Rule>
//           </FeatureTypeStyle>
//         </UserStyle>
//       </NamedLayer>
//     </StyledLayerDescriptor>`;

//   return result;
// }

/**
 * 创建高亮展示图层
 * @param features 高亮展示的json
 * @param map 地图map
 */
// function addHighLightLayer(features, map) {
//   const highLightStyle = new Style({
//       fill: new Fill(HIGH_LIGHT_STYLE_FILL),
//       stroke: new Stroke(HIGH_LIGHT_STYLE_STROKE),
//     }),
//     highLightFeatures = new GeoJSON().readFeatures(features);

//   map.getLayers().forEach((layer) => {
//     const layerType = layer?.get("name");

//     if (layerType === HIGH_LIGHT_LAYER) {
//       highLightLayer = layer;
//     }
//   });

//   if (!highLightLayer) {
//     highLightLayer = new VectorLayer({
//       opacity: 0.8,
//       source: new VectorSource(),
//       zIndex: 100,
//       style: highLightStyle,
//     });
//     highLightLayer.set("name", HIGH_LIGHT_LAYER);
//     map.addLayer(highLightLayer);
//   } else {
//     highLightLayer.getSource().clear();
//   }
//   highLightLayer.getSource().addFeatures(highLightFeatures);
// }

// 隐藏弹窗
function hideOverlayAndHighLight(overlay) {
  if (overlay) {
    overlay.setPosition(undefined);
  }

  if (highLightLayer) {
    highLightLayer.getSource().clear();
  }
}

// 创建弹窗
function createOverlay(element) {
  const overlay = new Overlay({
    element,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });

  overlay.setPosition(undefined);
  return overlay;
}

/**
 * 生成wmslayers
 * @param option
 * @returns {*} 图层
 */
function creatWmsLayer(option) {
  const { name, url, visible = true, index } = option;

  let layer,
    wmsParams = {
      SERVICE: "WMS",
      FORMAT: "image/png",
      VERSION: "1.1.0",
      transparent: true,
      LAYERS: name,
    };
  layer = new ImageLayer({
    visible: visible,
    zIndex: !index ? 10 : index,
    source: new ImageWMS({
      url,
      params: wmsParams,
    }),
  });
  layer.set("name", name);
  return layer;
}
// function creatWmsLayer(option) {
//   const { name, url, visible = true, index, cycle, time, colorArr } = option;

//   let layer,
//     wmsParams = {
//       SERVICE: "WMS",
//       FORMAT: "image/png",
//       VERSION: "1.1.0",
//       transparent: true,
//       time: getGeoTime(cycle, time),
//       LAYERS: name,
//     };

//   if (colorArr) {
//     console.log(colorArr, "colorArr");
//     wmsParams["sld_body"] = getStyle(colorArr, name);
//   }

//   layer = new ImageLayer({
//     visible: visible,
//     zIndex: !index ? 10 : index,
//     source: new ImageWMS({
//       url,
//       params: wmsParams,
//     }),
//   });

//   if (option.click === true) {
//     // layer.on("singleclick", (param) => {
//     //   hideOverlayAndHighLight();
//     //   const viewResolution = param.ol.viewer?.getResolution(),
//     //     projection = param.ol.viewer?.getProjection(),
//     //     { overlay, callBack, target = {} } = param,
//     //     { values_ = {} } = target,
//     //     { name: layerName } = values_,
//     //     url1 = layer
//     //       .getSource()
//     //       .getFeatureInfoUrl(
//     //         param.event.coordinate,
//     //         viewResolution,
//     //         projection,
//     //         {
//     //           INFO_FORMAT: "application/json",
//     //           QUERY_LAYERS: name,
//     //         }
//     //       );
//     //   // if (url1) {
//     //   //   axios.get(url1).then((res) => {
//     //   //     if (res.data?.features?.length > 0) {
//     //   //       const { properties } = res.data.features[0];
//     //   //       addHighLightLayer(res.data, param.ol.map);
//     //   //       overlay.setPosition(param.event.coordinate);
//     //   //       if (callBack) {
//     //   //         callBack(layerName, properties);
//     //   //       }
//     //   //       param.ol.map.addOverlay(overlay);
//     //   //     } else {
//     //   //       overlay.setPosition(undefined);
//     //   //       if (highLightLayer) {
//     //   //         highLightLayer.getSource().clear();
//     //   //       }
//     //   //     }
//     //   //   });
//     //   // }
//     // });
//   }
//   layer.set("name", name);
//   if (time) {
//     layer.set("time", time);
//   }
//   return layer;
// }

/**
 * 生成wmtslayers
 * @param option
 * @returns {*} 图层
 */
function creatWmtsLayer(option) {
  const {
    name,
    url,
    visible = true,
    index,
    crs = "EPSG:4326",
    resolutions,
    matrixIds,
    matrixSet,
    format = "tiles",
  } = option;

  let layer;

  const projection = get(crs || "EPSG:4326"),
    projectionExtent = projection.getExtent();

  let wmtsTileGrid = new TilegridWMTS({
    origin: getTopLeft(projectionExtent),
    resolutions: resolutions,
    matrixIds: matrixIds,
  });

  layer = new TileLayer({
    source: new ImageWMTS({
      url,
      layer: name,
      version: "1.0.0",
      // 坐标系矩阵集，一定要和WMTS capabilities文档中一致，否则会加载失败
      matrixSet,
      format,
      projection: projection,
      style: "default",
      tileGrid: wmtsTileGrid,
    }),
    zIndex: index === null ? 0 : index,
    visible: visible,
    className: name,
  });

  layer.set("name", name);
  return layer;
}

// 增加标记点
function creatPointLayer(option = {}, opts = {}) {
  // debugger;
  // 点图标大小,1=原始大小
  const { iconScale = 0.8 } = opts,
    { src, name } = option;

  let pointFeatures = [];

  option.data.forEach((item) => {
    const lon = item.x ? item.x : item.lon,
      lat = item.y ? item.y : item.lat,
      coor = [lon, lat],
      // 定义feature点
      iconFeature = new Feature({
        geometry: new Point(coor),
        attribute: {
          ...item,
        },
      });

    // 给feature点设置样式
    iconFeature.setStyle(
      new Style({
        image: new Icon({
          src: src,
          scale: toSize(iconScale),
        }),
      })
    );

    if (option.click === true) {
      iconFeature.on("singleclick", (param) => {
        hideOverlayAndHighLight();
        const { overlay, callBack, target = {} } = param,
          // const {values_={}} = target;
          { attribute } = target.getProperties();
        // const [width, height] = target?.getStyle()?.getImage()?.getScale();
        // const obj =target?.getStyle()?.getImage();

        // obj.setScale([width*2, height*2]);

        if (attribute) {
          overlay.setPosition(param.event.coordinate);
          if (callBack) {
            callBack(name, attribute);
          }
          param.ol.map.addOverlay(overlay);
        } else {
          overlay.setPosition(undefined);
        }
      });
    }

    pointFeatures.push(iconFeature);
  });

  const layer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures,
    }),
    zIndex: 20,
  });

  layer.set("name", name); // 添加图层类别标识
  return layer;
}

/**
 * 生成layer
 * @param option
 * @returns {*}
 */
function createLayer(option) {
  // debugger;
  const { name, type, url, alias, group, visible = true, index, crs } = option;

  let layer;

  const projection = crs || "EPSG:3857";
  switch (type) {
    case "tms":
      layer = new TileLayer({
        source: new XYZ({
          title: alias,
          url: url,
          // maxZoom: 10,
          projection,
        }),
        zIndex: index === null ? 0 : index,
        visible: visible,
        className: name,
      });
      layer.set("name", name);
      layer.set("group", group);
      return layer;
    case "wms":
      return creatWmsLayer(option);
    case "wmts":
      return creatWmtsLayer(option);
    case "pointVector":
      return creatPointLayer(option);
    default:
      break;
  }
}

/**
 * 显示对应图层
 * @param layers 图层总数
 * @param field 对应字段
 * @param value 对应值
 */
function showLayers(layers, field = "name", value) {
  layers.forEach((ele) => {
    const layer = ele.get(field);

    if (layer) {
      if (value === layer) {
        ele.setVisible(true);
      }
    }
  });
}

/**
 * 隐藏对应图层
 * @param layers 图层总数
 * @param field 对应字段
 * @param value 对应值
 */
function hideLayers(layers, field = "name", value) {
  layers.forEach((ele) => {
    const layer = ele.get(field);

    if (layer) {
      if (value === layer) {
        ele.setVisible(false);
      }
    }
  });
}

/**
 * 显示或隐藏图层
 * @param layers 图层总数
 * @param field 对应字段
 * @param value 对应值
 * @param flag  对应值的显示隐藏
 */
function showOrHideLayers(layers, field = "name", value, flag = true) {
  layers.forEach((ele) => {
    const layer = ele.get(field);

    if (layer) {
      if (value === layer) {
        ele.setVisible(flag);
      } else {
        ele.setVisible(!flag);
      }
    }
  });
}

/**
 * 获取图层图层
 * @param layers 图层总数
 * @param value name值
 */
function getLayerByName(layers, value) {
  let result = null;

  layers.forEach((ele) => {
    const layer = ele.get("name");

    if (layer) {
      if (value === layer) {
        result = ele;
        return result;
      }
    }
  });
  return result;
}

export {
  createLayer,
  showLayers,
  hideLayers,
  showOrHideLayers,
  getLayerByName,
  hideOverlayAndHighLight,
  createOverlay,
};
