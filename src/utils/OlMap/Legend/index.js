/*
 * @Author: 范有度
 * @Date: 2020-12-29 09:54:32
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-03-30 16:15:09
 * @Description: openlayers地图和常用工具类
 * @FilePath: \src\utils\OlMap\Legend\index.js
 */

function parseXML(data) {
  const result = [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");
  const pluginArray = xmlDoc.getElementsByTagName("Plugin");
  const len = pluginArray.length;

  for (let i = 0; i < len; i += 1) {
    const ele1 = pluginArray[i];

    let obj = {};
    const prodName = ele1.getAttribute("ProdName");
    const useLabel = ele1.getAttribute("label");
    const reMapArr = ele1.getElementsByTagName("ReMaps")[0].children;
    const reMaps = [];

    for (let j = 0; j < reMapArr.length; j += 1) {
      const ele2 = reMapArr[j];
      const color = ele2
        .getAttribute("Color")
        .split(",")
        .map((item) => Number(item));
      // 如果长度是三，说明没有设置透明色，默认设置为1

      if (color.length === 3) {
        color.push(1);
      }

      // 第一行插入第一个分级的最小值
      if (j === 0) {
        reMaps.push({
          color,
          value: ele2.getAttribute("MinV"),
          label: "",
        });
      }

      const maxV = ele2.getAttribute("MaxV");
      const label = ele2.getAttribute("Label");

      reMaps.push({
        color,
        value: maxV,
        label,
      });
    }

    obj = {
      prodName,
      reMaps,
      useLabel,
    };
    result.push(obj);
  }
  return result;
}

function drawLegend(style = {}, width = 30, height = 20, id = "legend-canvas") {
  if (!Object.keys(style).length) {
    document.getElementById("legend").style.display = "none";
    return;
  }
  document.getElementById("legend").style.display = "block";
  let legendName = "图例";
  const { reMaps = [], useLabel, unit } = style;

  if (unit) {
    legendName += ` （单位：${unit}）`;
  }
  let useforReMaps = reMaps;
  // 如果设置了透明度为0，则不显示

  useforReMaps = reMaps.filter((item) => item.color[3] !== 0);

  const colorArray = useforReMaps
    .map((item) => item.label && item.color)
    .filter(Boolean);
  const valueArray = useforReMaps
    .map((item) => (useLabel ? item.label || false : item.value))
    .filter(Boolean);
  const lens = valueArray.map((item) => item && item.length);
  const maxLens = useLabel ? Math.max.apply(null, lens) : 0;
  const widen1 = maxLens * 5;

  let widen2 = 10;

  if (legendName.length > 8) {
    widen2 = (legendName.length - 8) * 10;
  }
  const widen = widen1 > widen2 ? widen1 : widen2;

  const dataObj = [];

  if (colorArray) {
    colorArray.forEach((element) => {
      if (element) {
        const a = element[0];
        const b = element[1];
        const c = element[2];
        const d = element[3];
        const color = `rgba(${a},${b},${c},${d})`;

        dataObj.push(color);
      }
    });
  }

  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  const xheight = dataObj.length * height + 8; // 计算canvas宽度

  canvas.width = 80 + widen;
  canvas.height = xheight + 30;
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 450, xheight); // 绘制底图
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#fff";
  const str = legendName;

  ctx.fillText(str, 10, 15);

  for (let i = 0; i < dataObj.length; i++) {
    // 实现文字前面带色块
    ctx.fillStyle = dataObj[i]; // 块颜色
    ctx.fillRect(10, 25 + i * height, width, height); // 颜色块：x,y,w,h
  }
  for (let i = 0; i < valueArray.length; i++) {
    // 实现文字
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#fff";
    const txt = valueArray[i];

    ctx.fillText(txt, 46, useLabel ? 40 + i * height : 30 + i * height);
  }
}

export { parseXML, drawLegend };
