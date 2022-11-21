/* eslint-disable no-debugger */
/*
 * @Author: 王磊
 * @Date: 2021-01-28 15:49:14
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-03-30 16:15:51
 * @Description: openlayers请求矢量wms服务
 * @FilePath: \src\utils\OlMap\OLShpWMS.js
 */
import TileWMS from "ol/source/ImageWMS";
import TileLayer from "ol/layer/Image";

const geoWorkSpace = process.env.VUE_APP_GEOSERVER_WORKSPACE;

class OLShpWMS {
  constructor(props) {
    const { map } = props;

    this.map = map;
    this.curShpWMSLayer = null; // 当前添加的矢量wms图层
    this.shpWMSLayers = []; // 所有的矢量wms图层
  }

  // 增加矢量wms服务
  addShpWMSLayer(options) {
    const { url, params = {}, sldParams } = options;

    let { layers } = params;
    const { zIndex = 1000 } = params;

    let sldBody;

    if (sldParams) {
      sldBody = this.parseSLD(sldParams);
      params.SLD_BODY = sldBody;
    }
    const wmsSource = new TileWMS({
      url,
      params: {
        service: "WMS",
        format: "image/png",
        version: "1.1.0",
        transparent: true,
        ...params,
      },
    });

    this.curShpWMSLayer = new TileLayer({
      visible: true,
      source: wmsSource,
      zIndex,
    });
    if (!layers) {
      if (sldParams.layers.startsWith(`${geoWorkSpace}:`)) {
        // eslint-disable-next-line prefer-destructuring
        layers = sldParams.layers.split(":")[1];
      } else {
        layers = sldParams.layers;
      }
    }
    this.curShpWMSLayer.set("name", layers);

    this.shpWMSLayers.push(this.curShpWMSLayer);

    this.map.addLayer(this.curShpWMSLayer);
  }

  // 移除当前矢量wms服务
  removeCurShpWMSLayer() {
    this.map.removeLayer(this.curShpWMSLayer);
    this.curShpWMSLayer = null;
  }

  // 移除所有矢量wms服务
  removeShpWMSLayers() {
    this.shpWMSLayers.forEach((item) => {
      this.map.removeLayer(item);
    });
    this.shpWMSLayers = [];
  }

  // 移除指定的wms服务
  removeSpecifiedShpWMS(id) {
    const tempId = id.slice();

    while (tempId.length > 0) {
      this.map.getLayers().forEach((layer) => {
        const layerType = layer?.get("name");

        tempId.forEach((ele) => {
          if (layerType === ele) {
            this.map.removeLayer(layer);
            const index = tempId.indexOf(ele);

            tempId.splice(index, 1);
          }
        });
      });
    }
  }

  removeSpecifiedShpWMSSelf(id) {
    this.shpWMSLayers.forEach((item) => {
      const { id: layerId, layer } = item;

      id.forEach((ele) => {
        if (layerId === ele) {
          this.map.removeLayer(layer);
        }
      });
    });
  }

  // 增加和移除矢量wms服务
  toggleShpWMSLayer(options) {
    if (!this.curShpWMSLayer) {
      this.addShpWMSLayer(options);
    } else {
      this.removeCurShpWMSLayer();
    }
  }

  // 解析sld
  // eslint-disable-next-line class-methods-use-this
  parseSLD(params) {
    const { layers, lineColor, lineWidth } = params;
    //     return `<?xml version="1.0" encoding="GB2312"?>
    // <sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">
    //     <sld:UserLayer>
    //         <sld:LayerFeatureConstraints>
    //             <sld:FeatureTypeConstraint/>
    //         </sld:LayerFeatureConstraints>
    //         <sld:UserStyle>
    //             <sld:Name>AreaCounty</sld:Name>
    //             <sld:FeatureTypeStyle>
    //                 <sld:Name>group 0</sld:Name>
    //                 <sld:FeatureTypeName>Feature</sld:FeatureTypeName>
    //                 <sld:SemanticTypeIdentifier>generic:geometry</sld:SemanticTypeIdentifier>
    //                 <sld:SemanticTypeIdentifier>simple</sld:SemanticTypeIdentifier>
    //                 <sld:Rule>
    //                     <sld:Name>default rule</sld:Name>
    //                     <sld:PolygonSymbolizer>
    //                         <sld:Stroke>
    //                             <sld:CssParameter name="stroke">${lineColor}</sld:CssParameter>
    //                             <sld:CssParameter name="stroke-width">${lineWidth}</sld:CssParameter>
    //                         </sld:Stroke>
    //                     </sld:PolygonSymbolizer>
    //                 </sld:Rule>
    //             </sld:FeatureTypeStyle>
    //         </sld:UserStyle>
    //     </sld:UserLayer>
    // </sld:StyledLayerDescriptor>`;

    return `<?xml version="1.0" encoding="ISO-8859-1"?>
            <StyledLayerDescriptor version="1.0.0"
                xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
                xmlns="http://www.opengis.net/sld"
                xmlns:ogc="http://www.opengis.net/ogc"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <NamedLayer>
                <Name>${layers}</Name>
                <UserStyle>
                  <Title>SLD Cook Book: Transparent polygon</Title>
                  <FeatureTypeStyle>
                    <Rule>
                      <PolygonSymbolizer>
                        <Fill>
                          <CssParameter name="fill">#000080</CssParameter>
                          <CssParameter name="fill-opacity">0</CssParameter>
                        </Fill>
                        <Stroke>
                          <CssParameter name="stroke">${lineColor}</CssParameter>
                          <CssParameter name="stroke-width">${lineWidth}</CssParameter>
                        </Stroke>
                      </PolygonSymbolizer>
                    </Rule>
                  </FeatureTypeStyle>
                </UserStyle>
              </NamedLayer>
            </StyledLayerDescriptor>`;
  }
}

export default OLShpWMS;
