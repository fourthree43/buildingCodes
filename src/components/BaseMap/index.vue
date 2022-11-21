<!--
 * @Author: 张仕山
 * @Date: 2021-03-18 11:31:55
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-21 14:09:40
 * @Description: 地图组件
 * @FilePath: \src\components\BaseMap\index.vue
-->
<template>
  <section id="map-widget" class="map-widget">
    <div id="map-container" class="basemap"></div>
  </section>
</template>

<script>
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  onBeforeUnmount,
} from "vue";
import OlMap from "@/utils/OlMap/OLMap";
// import { ZoomToExtent, defaults as defaultControls } from "ol/control";
// import GeoJSON from "ol/format/GeoJSON";
// import { Vector as VectorSource } from "ol/source";

// function positiveView(url, $ol, callback) {
//   fetch(encodeURI(url))
//     .then((response) => response.json())
//     .then((data) => {
//       const { features } = data;
//       if (features && !!features.length) {
//         // 视图定位
//         const features = new GeoJSON().readFeatures(data);
//         const vecSource = new VectorSource();
//         vecSource.addFeatures(features);
//         let extent = vecSource.getExtent();
//         // 转投影
//         $ol.olmap.map.getView().fit(extent, {
//           // padding: [100, 50, 100, 50],
//         });
//         callback && callback(extent);
//       }
//     });
// }

export default {
  name: "BaseMap",
  components: {},
  setup(props, context) {
    const toolVisible = ref(true);
    const instance = getCurrentInstance(),
      $ol = instance.appContext.config.globalProperties.$ol,
      mapTpl = context.attrs.params.mapTpl,
      // 工具栏
      toolsOptions = mapTpl?.content?.tools;

    onMounted(() => {
      nextTick(() => {
        if (mapTpl) {
          // 初始化地图
          const olMap = new OlMap(mapTpl);
          $ol.olmap = olMap;
          // 加载1：100万
          // olMap.olVector.addVectorByGeoJsonOnly(millionSheet, {
          //   style: millionStyle,
          // });

          // const url = `/geoserver/fky/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=fky:region&maxFeatures=5000&outputFormat=application/json&srsName=EPSG:4326`;
          // positiveView(url, $ol, (extent) => {
          //   // 添加zoomToExtent
          //   const control = defaultControls().extend([
          //     new ZoomToExtent({
          //       extent: extent,
          //     }),
          //   ]);
          //   $ol.olmap.map.addControl(control);
          // });
        }
      });
    });
    onBeforeUnmount(() => {
      const mapDiv = document.getElementById("map-container");
      if (mapDiv && mapDiv.hasChildNodes()) {
        // let first = mapDiv.firstElementChild;
        // while (first) {
        //   first.remove();
        //   first = mapDiv.firstElementChild;
        // }
        mapDiv.innerHTML = null;
      }
    });
    return { toolsOptions, toolVisible };
  },
};
</script>

<style lang="scss">
#map-widget {
  &.map-widget {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .basemap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .map-right-content {
    position: absolute;
    right: 1rem;
    top: 1rem;
    display: flex;
    justify-content: flex-end;
    // width: 2rem;
    transition: 0.5s;
  }
}
</style>
