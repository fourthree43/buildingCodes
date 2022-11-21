/*
 * @Author: 张仕山
 * @Date: 2022-09-15 15:05:18
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-09-16 09:58:08
 * @Description:
 * @FilePath: \src\utils\OlMap\OLClickControl.js
 */
import { Stroke, Style, Fill, Text } from "ol/style";
import { toContext } from "ol/render";

const stroke = new Stroke({
  color: "#ff0000",
  width: 2,
});
const fill = new Fill({
  color: "rgba(255, 255, 255, 0.5)",
});

let fontSize = 10;
let originResolution = 0;
function measureTextLength(ctx, text, maxLength) {
  let fontSize = 5;
  ctx.font = `${fontSize}px serif`;
  const step = 5;
  let width = ctx.measureText(text).width; // TextMetrics object
  while (maxLength >= width) {
    fontSize += step;
    ctx.font = `${fontSize}px serif`;
    width = ctx.measureText(text).width;
    if (width >= 10000) {
      break;
    }
  }
  return fontSize - step;
}

class OLClickControl {
  constructor(map) {
    this.map = map;
    this.selected = [];
    this.listener = null;
  }

  addClickEvent() {
    // 绑定点击事件，用于选取图幅
    this.listener = (e) => {
      this.map.forEachFeatureAtPixel(e.pixel, (f) => {
        const selIndex = this.selected.indexOf(f);
        if (selIndex < 0) {
          const { issue, sheet } = f.getProperties();
          if (issue) {
            // const selectedStyle = new Style({
            //   fill: new Fill({
            //     color: "rgba(255, 255, 255, 0.5)",
            //   }),
            //   stroke: new Stroke({
            //     color: "#FF0000",
            //     width: 2,
            //   }),
            //   text: new Text({
            //     text: sheet,
            //     justify: "center",
            //     font: "10px sans-serif",
            //   }),
            // });
            const millionStyle = new Style({
              renderer: function (pixelCoordinates, state) {
                const { context, resolution, feature } = state;
                const sheet = feature.getProperties().sheet;
                const geometry = state.geometry.clone();
                geometry.setCoordinates(pixelCoordinates);

                context.save();
                const renderContext = toContext(context, {
                  pixelRatio: 1,
                  // size: [100, 100],
                });
                renderContext.setFillStrokeStyle(fill, stroke);
                renderContext.drawGeometry(geometry);

                const minX = Math.min(
                  ...pixelCoordinates[0].map((ele) => ele[0])
                );
                const maxX = Math.max(
                  ...pixelCoordinates[0].map((ele) => ele[0])
                );
                const minY = Math.min(
                  ...pixelCoordinates[0].map((ele) => ele[1])
                );
                const maxY = Math.max(
                  ...pixelCoordinates[0].map((ele) => ele[1])
                );

                context.strokeStyle = "rgb(180,123,69)";
                context.lineWidth = 2;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.font = `${fontSize}px serif`;

                // 自适应字体填充
                // 当分辨率发生变化 || 存在文本宽度大于外边框宽度时，要重新计算fontSize
                if (
                  !(Math.abs(originResolution - resolution) < 0.00000001) ||
                  context.measureText(sheet).width > maxX - minX
                ) {
                  fontSize = measureTextLength(context, sheet, maxX - minX);
                  context.font = `${fontSize}px serif`;
                  originResolution = resolution;
                }

                if (fontSize >= 5) {
                  context.strokeText(
                    sheet,
                    (maxX - minX) / 2 + minX,
                    (maxY - minY) / 2 + minY
                  );
                }
                context.clip();
                context.restore();
              },
            });
            f.setStyle(millionStyle);
            // f.setStyle(selectedStyle);
            this.selected.push(f);
          }
        } else {
          this.selected.splice(selIndex, 1);
          f.setStyle(undefined);
        }
      });
    };
    this.map.on("singleclick", this.listener);
  }

  removeClickEvent() {
    this.map.un("singleclick", this.listener);
  }

  clearSelectedFeatures() {
    this.selected.forEach((f) => f.setStyle(undefined));
    this.selected = [];
  }
}
export default OLClickControl;
