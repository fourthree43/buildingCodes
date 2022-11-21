/* eslint-disable */
/*
 * @Author: 王磊
 * @Date: 2021-01-05 13:53:24
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-09-14 17:42:33
 * @Description: ol矢量
 * @FilePath: \src\utils\OlMap\OLVector.js
 */
import { Stroke, Style, Fill } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import GeoJSON from "ol/format/GeoJSON";
import WKT from "ol/format/WKT";
import { unByKey } from "ol/Observable";
import Projection from "ol/proj/Projection";
import { Image as ImageLayer } from "ol/layer";
import ImageStatic from "ol/source/ImageStatic";
import Polygon from "ol/geom/Polygon";

const fileServer = process.env.VUE_APP_FILESERVER;

class OLVector {
  constructor(props) {
    this.olmap = props; // 地图对象实例

    this.style = {
      // renderer: this.renderFunction.bind(this),
      // stroke: new Stroke({
      //   color: "#243954",
      //   width: 2,
      // }),
      // fill: new Fill({
      //   color: "rgba(255, 253, 191, 0.05)",
      // }),
      fill: new Fill({
        color: "rgba(255, 255, 255, 0)",
      }),
      stroke: new Stroke({
        color: "#ff0000",
        // color: "#ffcc33",
        width: 2,
      }),
    };
    this.bufferStyle = {
      // renderer: this.renderFunction.bind(this),
      // stroke: new Stroke({
      //   color: "#243954",
      //   width: 2,
      // }),
      // fill: new Fill({
      //   color: "rgba(255, 253, 191, 0.05)",
      // }),
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "#1890ff",
        width: 2,
      }),
    };
    this.uniqueGeoLayers = null;

    this.hoverStyle = {
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255, 255, 255, 0)",
      }),
    };

    this.vecLayers = [];
    this.vecWktLayers = [];
    this.imageLayers = [];
    this.vecGeoLayers = null;
    this.vecWktLayer = null;
    this.vecClick = null;
  }

  // 添加geoJson图层
  addVectorByGeoJson(geoJson, config) {
    if (this.vecGeoLayers) {
      this.olmap.map.removeLayer(this.vecGeoLayers);
    }

    const { style, locate } = config;
    const vecSource = new VectorSource();
    this.vecGeoLayers = new VectorLayer({
      zIndex: 998,
    });

    this.vecGeoLayers.setStyle(
      style
        ? style instanceof Function
          ? style
          : new Style(style)
        : new Style(this.style)
    );
    this.vecGeoLayers.set("name", "vectorByGeoJson");
    this.vecLayers.push(this.vecGeoLayers);

    this.olmap.map.addLayer(this.vecGeoLayers);
    const features = new GeoJSON().readFeatures(geoJson);
    vecSource.addFeatures(features);
    this.vecGeoLayers.setSource(vecSource);
    if (locate) {
      this.viewCenter(this.vecGeoLayers);
    }
    return this.vecGeoLayers;
  }

  // 添加唯一图层(缓冲区图层)
  addUniqueVectorByGeoJson(geoJson, config = {}) {
    if (this.uniqueGeoLayers) {
      this.olmap.map.removeLayer(this.uniqueGeoLayers);
    }

    const { style, locate = false } = config;
    const vecSource = new VectorSource();
    this.uniqueGeoLayers = new VectorLayer({
      zIndex: 998,
    });

    this.uniqueGeoLayers.setStyle(
      style
        ? style instanceof Function
          ? style
          : new Style(style)
        : new Style(this.bufferStyle)
    );
    this.uniqueGeoLayers.set("name", "uniqueGeoLayers");

    this.olmap.map.addLayer(this.uniqueGeoLayers);
    const features = new GeoJSON().readFeatures(geoJson);
    vecSource.addFeatures(features);
    this.uniqueGeoLayers.setSource(vecSource);
    if (locate) {
      this.viewCenter(this.uniqueGeoLayers);
    }
    return this.uniqueGeoLayers;
  }
  // 移除唯一图层(缓冲区图层)
  removeUniqueVectorByGeoJson() {
    if (this.uniqueGeoLayers) {
      this.olmap.map.removeLayer(this.uniqueGeoLayers);
    }
  }

  // 添加wkt图层
  addVectorByWKT(wkt, config) {
    const { clear = false, locate, style, name, layerParam } = config;
    if (this.vecWktLayer && clear) {
      this.removeVectorByWKT();
    }
    const vecSource = new VectorSource();
    this.vecWktLayer = new VectorLayer({
      zIndex: 998,
      ...layerParam,
    });

    this.vecWktLayer.setStyle(style ? style : new Style(this.style));
    name && this.vecWktLayer.set("name", name);
    this.vecWktLayers.push(this.vecWktLayer);

    this.olmap.map.addLayer(this.vecWktLayer);
    const features = new WKT().readFeatures(wkt);
    vecSource.addFeatures(features);
    this.vecWktLayer.setSource(vecSource);
    if (locate) {
      this.viewCenter(this.vecWktLayer);
    }
    return this.vecWktLayer;
  }

  // 移除当前图层
  removeVectorByWKT() {
    this.olmap.map.removeLayer(this.vecWktLayer);
    const index = this.vecWktLayers.findIndex(
      (ele) => ele === this.vecWktLayer
    );
    if (index !== -1) {
      this.vecWktLayers.splice(index, 1);
    }
  }

  // 添加WKT图层 真实的框线
  addVectorByWKT2(obj, config = {}) {
    const {
      the_geom,
      pngbottomleftlatitude,
      pngbottomleftlongitude,
      pngbottomrightlatitude,
      pngbottomrightlongitude,
      pngtopleftlatitude,
      pngtopleftlongitude,
      pngtoprightlatitude,
      pngtoprightlongitude,
    } = obj;

    const tempGeo = new Polygon([
      [
        [pngbottomleftlongitude, pngbottomleftlatitude],
        [pngbottomrightlongitude, pngbottomrightlatitude],
        [pngtoprightlongitude, pngtoprightlatitude],
        [pngtopleftlongitude, pngtopleftlatitude],
        [pngbottomleftlongitude, pngbottomleftlatitude],
      ],
    ]);
    const wktObj = new WKT();
    const wktInfo = wktObj.writeGeometry(tempGeo);

    const { locate, attribute = {}, style } = config;
    const { removeLast } = attribute;

    if (removeLast) {
      // this.map.removeLayer(this.vecWKTLayer);
    }

    const vecWKTSource = new VectorSource();
    const vecWKTLayer = new VectorLayer({
      zIndex: 999,
      declutter: true,
    });
    // vecWKTLayer.id = attribute.id;
    vecWKTLayer.needClear = true;
    vecWKTLayer.setStyle(new Style(style || this.style));
    vecWKTLayer.set("name", "vecWKTLayer2");
    this.olmap.map.addLayer(vecWKTLayer);

    const wkt = new WKT();
    const feature = wkt.readFeature(the_geom);
    // feature.setProperties({ attribute: attribute });
    // feature.setId(attribute.id);
    vecWKTSource.addFeature(feature);
    vecWKTLayer.setSource(vecWKTSource);
    if (locate) {
      this.viewCenter(vecWKTLayer);
    }
    return vecWKTLayer;
  }

  // 添加WKT图层
  addLayerByWKT(wktStr, config = {}) {
    const format = new WKT();
    const features = format.readFeatures(wktStr);
    const { locate, attribute = {}, style } = config;
    const { removeLast } = attribute;

    if (removeLast) {
      this.olmap.map.removeLayer(this.vecWKTLayer);
      // this.vecLayers = this.vecLayers.filter((item) => item.id === this.vecLayers.id);
      // this.vecWktLayers = this.vecWktLayers.filter((item) => item.id === this.vecLayers.id);
    }

    this.vecWKTSource = new VectorSource();
    this.vecWKTLayer = new VectorLayer({
      zIndex: 999,
      declutter: true,
    });
    this.vecWKTLayer.id = attribute.id;
    this.vecWKTLayer.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(255,255,255,0)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255,255,255,0)",
        }),
      })
    );
    // this.vecWKTLayer.setStyle(new Style(style || this.style));
    this.vecLayers.push(this.vecWKTLayer);
    this.vecWktLayers.push(this.vecWKTLayer);
    this.vecWKTLayer.set("name", "vecWKTLayer");
    this.olmap.map.addLayer(this.vecWKTLayer);
    return this.vecWKTLayer;
  }

  // 添加WKT图层 经纬度
  addVectorByWKTForLonLat(wktStr, config = {}) {
    const { locate, attribute = {}, style } = config;
    const { removeLast } = attribute;

    if (removeLast) {
      this.olmap.map.removeLayer(this.vecWKTLayer);
    }

    this.vecWKTSource = new VectorSource();
    this.vecWKTLayer = new VectorLayer({
      zIndex: 998,
      declutter: true,
    });
    this.vecWKTLayer.id = attribute.id;
    this.vecWKTLayer.needClear = true;
    this.vecWKTLayer.setStyle(new Style(style || this.style));
    this.vecLayers.push(this.vecWKTLayer);
    this.vecWktLayers.push(this.vecWKTLayer);
    this.olmap.map.addLayer(this.vecWKTLayer);

    const wkt = new WKT();
    const feature = wkt.readFeature(wktStr);
    feature.setProperties({ attribute: attribute });
    feature.setId(attribute.id);
    this.vecWKTSource.addFeature(feature);
    this.vecWKTLayer.setSource(this.vecWKTSource);
    if (locate) {
      this.viewCenter(this.vecWKTLayer);
    }
    return this.vecWKTLayer;
  }

  // 改变WKT图层背景色
  resetWKTStyle(mapType) {
    switch (mapType) {
      case "影像图":
        const imageStyle = {
          stroke: new Stroke({
            color: "#243954",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(255, 253, 191, 0.3)",
          }),
        };
        this.vecWktLayers.forEach((i) => i.setStyle(new Style(imageStyle)));
        break;
      case "地形图":
        {
          const terrainStyle = {
            stroke: new Stroke({
              color: "#243954",
              width: 2,
            }),
            fill: new Fill({
              color: "rgba(47, 168, 252, 0.3)",
            }),
          };
          this.vecWktLayers.forEach((i) => i.setStyle(new Style(terrainStyle)));
        }
        break;
      case "矢量图":
        {
          const terrainStyle = {
            stroke: new Stroke({
              color: "#243954",
              width: 2,
            }),
            fill: new Fill({
              color: "rgba(47, 168, 252, 0.3)",
            }),
          };
          this.vecWktLayers.forEach((i) => i.setStyle(new Style(terrainStyle)));
        }
        break;
      default:
        break;
    }
  }

  // 移除WKT图层
  removeVectorByWKT(id) {
    this.vecWktLayers.forEach((item) => {
      if (item.id === id) {
        this.olmap.map.removeLayer(item);
      }
    });

    this.vecLayers = this.vecLayers.filter((item) => item.id !== id);
    this.vecWktLayers = this.vecWktLayers.filter((item) => item.id !== id);
  }
  // 移除WKT图层
  removeVectorByName(name) {
    this.vecLayers.forEach((item) => {
      if (item.values_.name === name) {
        this.olmap.map.removeLayer(item);
      }
    });

    this.vecLayers = this.vecLayers.filter(
      (item) => item.values_.name !== name
    );
    this.vecWktLayers = this.vecWktLayers.filter(
      (item) => item.values_.name !== name
    );
  }
  // 当前悬浮边框高亮
  borderHighlight(item) {
    this.vecWktLayers.forEach((layer) => {
      const source = layer.getSource();
      const features = source.getFeatureById(item.id);
      if (features) {
        layer.setStyle(new Style(this.hoverStyle));
      } else {
        layer.setStyle(new Style(this.style));
      }
    });
  }

  /* 样例-------------------- */
  //canvas 绘制图片
  drawImageInPoints(ctx, image, points) {
    var xSize,
      ySize,
      xTan,
      yTan,
      width = 50,
      height = 50,
      transform = {},
      p0 = points[0],
      p1 = points[1],
      p3 = points[3];

    // 根据图片左上角的坐标 设置e和f
    transform.e = p0[0];
    transform.f = p0[1];

    // 根据进行斜切之前的矩形和图片尺寸的大小关系 设置a和d
    xSize = p1[0] - p0[0];
    transform.a = xSize / width;
    ySize = p3[1] - p0[1];
    transform.d = ySize / height;

    // 根据图片是否需要斜切，来设置 设置b和d
    // 水平斜切，水平线旋转到目标线的角度的正切值，角度以顺时针旋转为正
    // 垂直斜切，垂直线旋转到目标线的角度的正切值，角度以逆时针旋转为正
    if (p1[0] === p0[0]) {
      transform.b = 0;
    } else {
      xTan = (p1[1] - p0[1]) / (p1[0] - p0[0]);
      transform.b = xTan * transform.a;
    }

    if (p3[1] === p0[1]) {
      transform.c = 0;
    } else {
      yTan = (p3[0] - p0[0]) / (p3[1] - p0[1]);
      transform.c = yTan * transform.d;
    }

    ctx.save();
    ctx.transform(
      transform.a,
      transform.b,
      transform.c,
      transform.d,
      transform.e,
      transform.f
    );
    ctx.strokeStyle = "#6cf";
    ctx.drawImage(image, 0, 0, width, height);
    ctx.restore();
  }

  // 样式绘制
  renderFunction(pngUrl, coords, state) {
    const ctx = state.context;
    const pts = coords[0];
    const count = pts.length;
    // 绘制边框
    // ctx.save();
    // for (let i = 0; i < count; i++) {
    //   const x = pts[i][0];
    //   const y = pts[i][1];
    //   if (i === 0) {
    //     ctx.moveTo(x, y);
    //   } else {
    //     ctx.lineTo(x, y);
    //   }
    // }
    // ctx.strokeStyle = '#4291ff';
    // ctx.lineWidth = 2;
    // ctx.stroke();
    // ctx.restore();
    if (pts.length >= 4) {
      this.drawImageInPoints(ctx, pngUrl, pts);
    }
  }
  /* 样例-------------------- */
  removeImageLayer1(config = {}, type = {}) {
    const { index } = config;
    const { mapType, fill } = type;
    const curVecWKTLayer = this.vecWktLayers.find((i) => i.id === index);
    let style;
    if (!fill) {
      style = {
        stroke: new Stroke({
          // color: '#243954',
          color: "rgba(47, 168, 252, 0)",
          width: 2,
        }),
      };
    } else {
      // style = {
      //   // renderer: this.renderFunction.bind(this),
      //   stroke: new Stroke({
      //     color: '#243954',
      //     width: 2,
      //   }),
      //   fill: new Fill({
      //     color: mapType === '影像图' ? 'rgba(255, 253, 191, 0.3)' : 'rgba(47, 168, 252, 0.3)',
      //   }),
      // };
      style = {
        // renderer: this.renderFunction.bind(this),
        stroke: new Stroke({
          color: "rgba(47, 168, 252, 0)",
          width: 2,
        }),
        fill: new Fill({
          color:
            mapType === "影像图"
              ? "rgba(255, 253, 191, 0)"
              : "rgba(47, 168, 252, 0)",
        }),
      };
    }
    curVecWKTLayer.setStyle(new Style(style));
    curVecWKTLayer.setZIndex(999);
  }

  // 添加图片图层
  addImageLayer1(data, config = {}) {
    const { index } = config;
    const { pngurl } = data;
    const curVecWKTLayer = this.vecWktLayers.find((i) => i.id === index);

    const img = new Image();
    // eslint-disable-next-line operator-linebreak
    img.src = fileServer + pngurl.replace("/production", "");

    const style = {
      renderer: this.renderFunction.bind(this, img),
      // stroke: new Stroke({
      //   color: '#4291ff',
      //   width: 2,
      // }),
      // fill: new Fill({
      //   color: 'rgba(255, 255, 255, 0)',
      // }),
    };
    curVecWKTLayer.setStyle(new Style(style));

    const maxLayers = this.vecWktLayers.reduce(
      (x, y) => (x.getZIndex() >= y.getZIndex() ? x : y),
      curVecWKTLayer
    );
    curVecWKTLayer.setZIndex(maxLayers.getZIndex() + 1);
    this.olmap.map.getView().fit(curVecWKTLayer.getSource().getExtent(), {
      padding: [200, 100, 200, 400],
    });
  }

  // 添加图片图层
  addImageLayer(data, config = {}) {
    const { zIndex = 1000 } = config;
    const {
      pngbottomleftlongitude,
      pngbottomleftlatitude,
      pngtoprightlongitude,
      pngtoprightlatitude,
      pngurl = "",
      id,
    } = data;
    const extent = [
      pngbottomleftlongitude,
      pngbottomleftlatitude,
      pngtoprightlongitude,
      pngtoprightlatitude,
    ];

    const projection = new Projection({
      code: "ImageStatic",
      extent,
    });

    const imageLayer = new ImageLayer({
      source: new ImageStatic({
        url: fileServer + pngurl.replace("/production", ""),
        projection,
        imageExtent: extent,
      }),
      zIndex: zIndex || 1000,
    });
    this.vecLayers.push(imageLayer);
    this.imageLayers.push({ id, imageLayer });
    this.olmap.map.addLayer(imageLayer);
  }

  // 移除图片图层
  removeImageLayer(data) {
    this.imageLayers.forEach((item) => {
      if (item.id === data.id) {
        this.olmap.map.removeLayer(item.imageLayer);
      }
    });
  }

  // 添加矢量点击事件
  addClickVec() {
    unByKey(this.vecClick);

    this.vecClick = this.olmap.map.on("click", (evt) => {
      this.olmap.map.forEachFeatureAtPixel(evt.pixel, (res) => {
        const propertys = res.getProperties();
        const { attribute } = propertys;
        if (attribute) {
          this.addImageLayer(attribute);
        }
      });
    });
  }

  // 清除WKT和image图层
  removeWKTAndImage() {
    this.vecWktLayers.forEach((item) => this.olmap.map.removeLayer(item));
    this.vecWktLayers = [];
    this.imageLayers.forEach((item) =>
      this.olmap.map.removeLayer(item.imageLayer)
    );

    unByKey(this.vecClick);
  }

  // 批量加载所有矢量
  addAllVec() {
    this.vecLayers.forEach((item) => this.olmap.map.addLayer(item));
  }

  // 清除所有加载的矢量
  removeAllVec() {
    this.vecLayers.forEach((item) => this.olmap.map.removeLayer(item));
    this.vecLayers = [];
    this.vecWktLayers = [];

    const tempArr = [];
    this.olmap.map.getLayers().forEach((ele) => {
      const name = ele?.get("name");
      if (name === "vecWKTLayer2") {
        tempArr.push(ele);
      }
    });
    let num = tempArr.length;
    while (num) {
      this.olmap.map.getLayers().forEach((ele, index) => {
        const name = ele?.get("name");
        if (name === "vecWKTLayer2") {
          this.olmap.map.removeLayer(ele);
          tempArr.splice(index, 1);
          num -= 1;
        }
      });
    }
  }

  // 视角居中
  viewCenter(vecLayer) {
    const extent = vecLayer.getSource().getExtent();
    const size = this.olmap.map.getSize();
    // 地图视角定位
    this.olmap.map.getView().fit(extent, { size, padding: [100, 0, 100, 100] });
  }

  // 添加geoJson图层
  addVectorByGeoJsonOnly(geoJson, config) {
    const { style, locate } = config;
    const vecSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      zIndex: 998,
    });

    vectorLayer.setStyle(style || new Style(this.style));
    this.vecLayers.push(vectorLayer);

    this.olmap.map.addLayer(vectorLayer);
    const features = new GeoJSON().readFeatures(geoJson);
    vecSource.addFeatures(features);
    vectorLayer.setSource(vecSource);
    if (locate) {
      this.viewCenter(vectorLayer);
    }
    return vectorLayer;
  }
}

export default OLVector;
