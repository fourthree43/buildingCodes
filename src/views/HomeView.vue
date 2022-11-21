<!--
 * @Author: 张仕山
 * @Date: 2022-08-23 17:56:06
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-21 13:56:36
 * @Description:  
 * @FilePath: \src\views\HomeView.vue
-->
<template>
  <div class="home">
    <div class="select-container">
      <a-cascader
        v-model:value="value"
        placeholder="请选择区域"
        :options="options"
        @change="change"
      />
    </div>
    <BaseMap :params="{ mapTpl: mapTpl }" />
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
// @ is an alias to /src
import BaseMap from "../components/BaseMap/index.vue";
import olDefault from "../../public/tpl/olDefault.json";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorSource } from "ol/source";
// import { toLonLat } from "ol/proj";
const options = [
  {
    value: "001",
    label: "甘蔗街道",
    children: [
      {
        value: "001",
        label: "福龙社区",
      },
      {
        value: "002",
        label: "三福社区",
      },
      {
        value: "003",
        label: "双福社区",
      },
      {
        value: "004",
        label: "滨江社区",
      },
      {
        value: "005",
        label: "瀛洲社区居委会",
      },
      {
        value: "201",
        label: "青岐村委会",
      },
      {
        value: "202",
        label: "十字村委会",
      },
      {
        value: "203",
        label: "长江村委会",
      },
      {
        value: "204",
        label: "大元村委会",
      },
      {
        value: "205",
        label: "双池村委会",
      },
      {
        value: "206",
        label: "五福村委会",
      },
      {
        value: "207",
        label: "化龙村委会",
      },
      {
        value: "208",
        label: "三英村委会",
      },
      {
        value: "209",
        label: "山前村委会",
      },
      {
        value: "210",
        label: "横屿村委会",
      },
      {
        value: "211",
        label: "昙石村委会",
      },
      {
        value: "212",
        label: "洽浦村委会",
      },
      {
        value: "213",
        label: "南山村委会",
      },
      {
        value: "214",
        label: "流洋村委会",
      },
    ],
  },
  {
    value: "101",
    label: "白沙镇",
    children: [
      {
        value: "001",
        label: "白沙社区",
      },
      {
        value: "002",
        label: "闽兴社区",
      },
      {
        value: "003",
        label: "云头岭社区",
      },
      {
        value: "004",
        label: "木帆社社区",
      },
      {
        value: "201",
        label: "白沙村委会",
      },
      {
        value: "202",
        label: "大濑村委会",
      },
      {
        value: "203",
        label: "马坑村委会",
      },
      {
        value: "204",
        label: "汶溪村委会",
      },
      {
        value: "205",
        label: "溪头村委会",
      },
      {
        value: "206",
        label: "楼格村委会",
      },
      {
        value: "207",
        label: "孔元村委会",
      },
      {
        value: "208",
        label: "井下村委会",
      },
      {
        value: "209",
        label: "新坡村委会",
      },
      {
        value: "210",
        label: "上寨村委会",
      },
      {
        value: "211",
        label: "林柄村委会",
      },
      {
        value: "212",
        label: "大目溪村委会",
      },
      {
        value: "213",
        label: "院埕村委会",
      },
      {
        value: "214",
        label: "梧桐下村委会",
      },
      {
        value: "215",
        label: "汤院村委会",
      },
      {
        value: "216",
        label: "大目埕村委会",
      },
      {
        value: "217",
        label: "洋石村委会",
      },
      {
        value: "218",
        label: "唐举村委会",
      },
      {
        value: "219",
        label: "上岐村委会",
      },
      {
        value: "220",
        label: "联坑村委会",
      },
      {
        value: "221",
        label: "坑头村委会",
      },
    ],
  },
  {
    value: "102",
    label: "南屿镇",
    children: [
      {
        value: "001",
        label: "南屿社区",
      },
      {
        value: "002",
        label: "南旗社区",
      },
      {
        value: "003",
        label: "旗山文城社区",
      },
      {
        value: "201",
        label: "龙泉村委会",
      },
      {
        value: "202",
        label: "九都村委会",
      },
      {
        value: "203",
        label: "桐南村委会",
      },
      {
        value: "204",
        label: "窗厦村委会",
      },
      {
        value: "205",
        label: "芝田村委会",
      },
      {
        value: "206",
        label: "玉田村委会",
      },
      {
        value: "207",
        label: "茂田村委会",
      },
      {
        value: "208",
        label: "新联村委会",
      },
      {
        value: "209",
        label: "五都村委会",
      },
      {
        value: "210",
        label: "中溪村委会",
      },
      {
        value: "211",
        label: "尧沙村委会",
      },
      {
        value: "212",
        label: "江口村委会",
      },
      {
        value: "213",
        label: "柳浪村委会",
      },
      {
        value: "214",
        label: "六十份村委会",
      },
      {
        value: "215",
        label: "后山村委会",
      },
      {
        value: "216",
        label: "流州村委会",
      },
      {
        value: "217",
        label: "元峰村委会",
      },
      {
        value: "218",
        label: "高岐村委会",
      },
      {
        value: "219",
        label: "葛岐村委会",
      },
      {
        value: "220",
        label: "晓岐村委会",
      },
      {
        value: "221",
        label: "南井村委会",
      },
      {
        value: "222",
        label: "南前村委会",
      },
      {
        value: "500",
        label: "南屿林场生活区",
      },
    ],
  },
  {
    value: "103",
    label: "尚干镇",
    children: [
      {
        value: "001",
        label: "尚干社区",
      },
      {
        value: "002",
        label: "浦里社区",
      },
      {
        value: "201",
        label: "东升村委会",
      },
      {
        value: "202",
        label: "过浦村委会",
      },
      {
        value: "203",
        label: "洋中村委会",
      },
      {
        value: "204",
        label: "后村村委会",
      },
      {
        value: "205",
        label: "乌门村委会",
      },
      {
        value: "206",
        label: "亭上村委会",
      },
      {
        value: "207",
        label: "红新村委会",
      },
      {
        value: "208",
        label: "龙醒村委会",
      },
      {
        value: "209",
        label: "后福村委会",
      },
      {
        value: "210",
        label: "后浦村委会",
      },
      {
        value: "211",
        label: "后厝村委会",
      },
    ],
  },
  {
    value: "104",
    label: "祥谦镇",
    children: [
      {
        value: "001",
        label: "峡南社区",
      },
      {
        value: "002",
        label: "新建社区",
      },
      {
        value: "201",
        label: "兰圃村委会",
      },
      {
        value: "202",
        label: "枕峰村委会",
      },
      {
        value: "203",
        label: "泮洋村委会",
      },
      {
        value: "204",
        label: "凤港村委会",
      },
      {
        value: "205",
        label: "洋下村委会",
      },
      {
        value: "206",
        label: "双龙村委会",
      },
      {
        value: "207",
        label: "琯前村委会",
      },
      {
        value: "208",
        label: "岐尾村委会",
      },
      {
        value: "209",
        label: "澜澄村委会",
      },
      {
        value: "210",
        label: "虎山村委会",
      },
      {
        value: "211",
        label: "卜洲村委会",
      },
      {
        value: "212",
        label: "辅翼村委会",
      },
      {
        value: "213",
        label: "三溪口村委会",
      },
      {
        value: "214",
        label: "中院村委会",
      },
      {
        value: "215",
        label: "门口村委会",
      },
      {
        value: "216",
        label: "肖家道村会",
      },
      {
        value: "217",
        label: "禄家村委会",
      },
      {
        value: "218",
        label: "江中村委会",
      },
    ],
  },
  {
    value: "105",
    label: "青口镇",
    children: [
      {
        value: "001",
        label: "青新社区",
      },
      {
        value: "002",
        label: "青口社区",
      },
      {
        value: "201",
        label: "东台村委会",
      },
      {
        value: "202",
        label: "西台村委会",
      },
      {
        value: "203",
        label: "联丰村委会",
      },
      {
        value: "204",
        label: "坊口村委会",
      },
      {
        value: "205",
        label: "溪东村委会",
      },
      {
        value: "206",
        label: "前街村委会",
      },
      {
        value: "207",
        label: "后街村委会",
      },
      {
        value: "208",
        label: "大埕村委会",
      },
      {
        value: "209",
        label: "长楼村委会",
      },
      {
        value: "210",
        label: "船尾村委会",
      },
      {
        value: "211",
        label: "宏一村委会",
      },
      {
        value: "212",
        label: "宏二村委会",
      },
      {
        value: "213",
        label: "宏三村委会",
      },
      {
        value: "214",
        label: "宏四村委会",
      },
      {
        value: "215",
        label: "吉山村委会",
      },
      {
        value: "216",
        label: "后福村委会",
      },
      {
        value: "217",
        label: "青林村委会",
      },
      {
        value: "218",
        label: "联光村委会",
      },
      {
        value: "219",
        label: "梅岭村委会",
      },
      {
        value: "220",
        label: "莲峰村委会",
      },
      {
        value: "221",
        label: "付竹村民委员会",
      },
      {
        value: "222",
        label: "梅溪村委会",
      },
      {
        value: "223",
        label: "沪屿村委会",
      },
      {
        value: "224",
        label: "村里村委会",
      },
      {
        value: "225",
        label: "壶山村委会",
      },
      {
        value: "226",
        label: "农光村委会",
      },
      {
        value: "227",
        label: "庄头村委会",
      },
      {
        value: "228",
        label: "杨厝村委会",
      },
      {
        value: "229",
        label: "镜上村委会",
      },
      {
        value: "231",
        label: "团结村委会",
      },
      {
        value: "232",
        label: "文华村委会",
      },
      {
        value: "233",
        label: "青秀村委会",
      },
      {
        value: "234",
        label: "升旗村委会",
      },
      {
        value: "235",
        label: "红旗村委会",
      },
      {
        value: "236",
        label: "幸福村委会",
      },
      {
        value: "237",
        label: "青布里村委会",
      },
      {
        value: "238",
        label: "青布岭村委会",
      },
      {
        value: "239",
        label: "前洋村委会",
      },
    ],
  },
  {
    value: "106",
    label: "南通镇",
    children: [
      {
        value: "001",
        label: "南通社区",
      },
      {
        value: "002",
        label: "桥街社区",
      },
      {
        value: "202",
        label: "银安村委会",
      },
      {
        value: "203",
        label: "洲头村委会",
      },
      {
        value: "204",
        label: "上洲村委会",
      },
      {
        value: "205",
        label: "泽苗村委会",
      },
      {
        value: "206",
        label: "廷宅村委会",
      },
      {
        value: "207",
        label: "泽洋村委会",
      },
      {
        value: "209",
        label: "陈厝村委会",
      },
      {
        value: "210",
        label: "罗州村委会",
      },
      {
        value: "211",
        label: "瓜山村委会",
      },
      {
        value: "212",
        label: "建南村委会",
      },
      {
        value: "213",
        label: "古城村委会",
      },
      {
        value: "214",
        label: "文山村委会",
      },
      {
        value: "215",
        label: "马腾村委会",
      },
      {
        value: "216",
        label: "新岐村委会",
      },
      {
        value: "217",
        label: "方庄村委会",
      },
    ],
  },
  {
    value: "107",
    label: "上街镇",
    children: [
      {
        value: "001",
        label: "上街社区",
      },
      {
        value: "002",
        label: "新峰社区",
      },
      {
        value: "003",
        label: "红峰社区",
      },
      {
        value: "004",
        label: "庄南社区",
      },
      {
        value: "005",
        label: "博海湾社区",
      },
      {
        value: "201",
        label: "侯官村委会",
      },
      {
        value: "202",
        label: "厚美村委会",
      },
      {
        value: "206",
        label: "沙堤村委会",
      },
      {
        value: "207",
        label: "联心村委会",
      },
      {
        value: "208",
        label: "榕桥村委会",
      },
      {
        value: "210",
        label: "溪源宫村委会",
      },
      {
        value: "211",
        label: "美岐村委会",
      },
      {
        value: "212",
        label: "青州村委会",
      },
      {
        value: "213",
        label: "岐安村委会",
      },
      {
        value: "214",
        label: "岐头村委会",
      },
      {
        value: "215",
        label: "中美村委会",
      },
      {
        value: "216",
        label: "金屿村委会",
      },
      {
        value: "217",
        label: "浦口村委会",
      },
      {
        value: "218",
        label: "建平村委会",
      },
      {
        value: "219",
        label: "蔗洲村委会",
      },
      {
        value: "220",
        label: "厚庭村委会",
      },
      {
        value: "221",
        label: "马保村委会",
      },
      {
        value: "222",
        label: "新洲村委会",
      },
      {
        value: "223",
        label: "马排村委会",
      },
    ],
  },
  {
    value: "108",
    label: "荆溪镇",
    children: [
      {
        value: "001",
        label: "荆溪社区",
      },
      {
        value: "002",
        label: "厚屿社区",
      },
      {
        value: "003",
        label: "古山洲社区",
      },
      {
        value: "004",
        label: "永丰社区",
      },
      {
        value: "005",
        label: "大佳社区",
      },
      {
        value: "006",
        label: "福鼓社区",
      },
      {
        value: "007",
        label: "临江社区居委会",
      },
      {
        value: "201",
        label: "荷洋村委会",
      },
      {
        value: "202",
        label: "仁洲村委会",
      },
      {
        value: "203",
        label: "六墩村民委员会",
      },
      {
        value: "204",
        label: "关中村委会",
      },
      {
        value: "205",
        label: "关西村委会",
      },
      {
        value: "206",
        label: "埔前村委会",
      },
      {
        value: "207",
        label: "关东村委会",
      },
      {
        value: "208",
        label: "关口村委会",
      },
      {
        value: "210",
        label: "溪下村委会",
      },
      {
        value: "211",
        label: "港头村委会",
      },
      {
        value: "212",
        label: "光明村委会",
      },
      {
        value: "213",
        label: "桐口村委会",
      },
      {
        value: "216",
        label: "桃田村委会",
      },
    ],
  },
  {
    value: "200",
    label: "竹岐乡",
    children: [
      {
        value: "201",
        label: "苏洋村委会",
      },
      {
        value: "202",
        label: "白龙村委会",
      },
      {
        value: "203",
        label: "春风村委会",
      },
      {
        value: "204",
        label: "榕东村委会",
      },
      {
        value: "205",
        label: "榕中村委会",
      },
      {
        value: "206",
        label: "榕西村委会",
      },
      {
        value: "207",
        label: "汶洲村委会",
      },
      {
        value: "208",
        label: "山洋村委会",
      },
      {
        value: "209",
        label: "竹岐村委会",
      },
      {
        value: "210",
        label: "竹西村委会",
      },
      {
        value: "211",
        label: "元格村委会",
      },
      {
        value: "212",
        label: "火炬村委会",
      },
      {
        value: "213",
        label: "半岭村委会",
      },
      {
        value: "214",
        label: "南洋村委会",
      },
      {
        value: "215",
        label: "罗洋村委会",
      },
      {
        value: "216",
        label: "叶洋村委会",
      },
      {
        value: "217",
        label: "前山村委会",
      },
      {
        value: "218",
        label: "蒲洋村委会",
      },
      {
        value: "219",
        label: "溪南村委会",
      },
      {
        value: "220",
        label: "里洋村委会",
      },
      {
        value: "221",
        label: "天台村委会",
      },
      {
        value: "222",
        label: "春光村委会",
      },
    ],
  },
  {
    value: "201",
    label: "鸿尾乡",
    children: [
      {
        value: "201",
        label: "里头村委会",
      },
      {
        value: "202",
        label: "岩石村委会",
      },
      {
        value: "203",
        label: "安樟村委会",
      },
      {
        value: "204",
        label: "南元村委会",
      },
      {
        value: "205",
        label: "大罕村委会",
      },
      {
        value: "206",
        label: "溪元村委会",
      },
      {
        value: "207",
        label: "桥头村委会",
      },
      {
        value: "208",
        label: "南坑村委会",
      },
      {
        value: "209",
        label: "大坑村委会",
      },
      {
        value: "210",
        label: "鸿尾村委会",
      },
      {
        value: "211",
        label: "大模村委会",
      },
      {
        value: "212",
        label: "官路村委会",
      },
      {
        value: "213",
        label: "超墘村委会",
      },
      {
        value: "214",
        label: "汉头村委会",
      },
      {
        value: "215",
        label: "奎石村委会",
      },
      {
        value: "216",
        label: "元口村委会",
      },
      {
        value: "217",
        label: "南下村委会",
      },
      {
        value: "218",
        label: "埕头村委会",
      },
      {
        value: "219",
        label: "青马村委会",
      },
      {
        value: "220",
        label: "古洋村委会",
      },
    ],
  },
  {
    value: "202",
    label: "洋里乡",
    children: [
      {
        value: "201",
        label: "洋里村委会",
      },
      {
        value: "202",
        label: "安仁村委会",
      },
      {
        value: "203",
        label: "锡地村委会",
      },
      {
        value: "204",
        label: "茶苑村委会",
      },
      {
        value: "205",
        label: "绅带村委会",
      },
      {
        value: "206",
        label: "新见村委会",
      },
      {
        value: "207",
        label: "花桥村委会",
      },
      {
        value: "208",
        label: "仙门村委会",
      },
      {
        value: "209",
        label: "岭兜村委会",
      },
      {
        value: "210",
        label: "仙洋村委会",
      },
      {
        value: "211",
        label: "后坑村委会",
      },
      {
        value: "212",
        label: "张际村委会",
      },
      {
        value: "213",
        label: "长基村委会",
      },
      {
        value: "214",
        label: "林洋村委会",
      },
      {
        value: "215",
        label: "刘洋村委会",
      },
      {
        value: "216",
        label: "刘地村委会",
      },
      {
        value: "217",
        label: "田垱村委会",
      },
      {
        value: "218",
        label: "金田村委会",
      },
      {
        value: "219",
        label: "廷洋村委会",
      },
      {
        value: "220",
        label: "洋头村委会",
      },
      {
        value: "221",
        label: "梧溪村委会",
      },
      {
        value: "222",
        label: "友泉村委会",
      },
      {
        value: "223",
        label: "梧洋村委会",
      },
      {
        value: "224",
        label: "际兜村村民委员会",
      },
    ],
  },
  {
    value: "203",
    label: "大湖乡",
    children: [
      {
        value: "201",
        label: "新塘村委会",
      },
      {
        value: "202",
        label: "箬洋村委会",
      },
      {
        value: "203",
        label: "马墘村委会",
      },
      {
        value: "204",
        label: "洋山村委会",
      },
      {
        value: "205",
        label: "后井村委会",
      },
      {
        value: "206",
        label: "仙山村委会",
      },
      {
        value: "207",
        label: "大坪村委会",
      },
      {
        value: "208",
        label: "珍山村委会",
      },
      {
        value: "209",
        label: "后洋村委会",
      },
      {
        value: "210",
        label: "双溪村委会",
      },
      {
        value: "211",
        label: "上苑村委会",
      },
      {
        value: "212",
        label: "大池村委会",
      },
      {
        value: "213",
        label: "兰田村委会",
      },
      {
        value: "214",
        label: "碾坑村委会",
      },
      {
        value: "215",
        label: "岭头村委会",
      },
      {
        value: "216",
        label: "东姚村委会",
      },
      {
        value: "217",
        label: "墙坪村委会",
      },
      {
        value: "218",
        label: "东墘村委会",
      },
      {
        value: "219",
        label: "坂头村委会",
      },
      {
        value: "220",
        label: "茶坪村委会",
      },
      {
        value: "221",
        label: "六锦村委会",
      },
      {
        value: "222",
        label: "大湖村委会",
      },
      {
        value: "223",
        label: "雪峰村委会",
      },
    ],
  },
  {
    value: "204",
    label: "廷坪乡",
    children: [
      {
        value: "201",
        label: "廷坪村委会",
      },
      {
        value: "202",
        label: "溪坪村委会",
      },
      {
        value: "203",
        label: "西坑村委会",
      },
      {
        value: "204",
        label: "下洋村委会",
      },
      {
        value: "205",
        label: "文山岗村委会",
      },
      {
        value: "206",
        label: "黄埔村委会",
      },
      {
        value: "207",
        label: "洪山村委会",
      },
      {
        value: "208",
        label: "岩头村委会",
      },
      {
        value: "209",
        label: "西山村委会",
      },
      {
        value: "210",
        label: "马厝村委会",
      },
      {
        value: "211",
        label: "盘岭村委会",
      },
      {
        value: "212",
        label: "赤坑村委会",
      },
      {
        value: "213",
        label: "罗桥村委会",
      },
      {
        value: "214",
        label: "蕉溪村委会",
      },
      {
        value: "215",
        label: "曹地村委会",
      },
      {
        value: "216",
        label: "汶合村委会",
      },
      {
        value: "217",
        label: "广坪村委会",
      },
      {
        value: "218",
        label: "石洋村委会",
      },
      {
        value: "219",
        label: "石井村委会",
      },
      {
        value: "220",
        label: "流源村委会",
      },
      {
        value: "221",
        label: "尾桥村委会",
      },
      {
        value: "222",
        label: "塘里村委会",
      },
      {
        value: "223",
        label: "石坑村委会",
      },
      {
        value: "224",
        label: "后溪村委会",
      },
      {
        value: "225",
        label: "池坑村委会",
      },
    ],
  },
  {
    value: "206",
    label: "小箬乡",
    children: [
      {
        value: "201",
        label: "小箬村委会",
      },
      {
        value: "202",
        label: "湖柄村委会",
      },
      {
        value: "203",
        label: "西村村委会",
      },
      {
        value: "204",
        label: "大坂村委会",
      },
      {
        value: "205",
        label: "中平村委会",
      },
      {
        value: "206",
        label: "福田村委会",
      },
      {
        value: "207",
        label: "尚格村委会",
      },
      {
        value: "208",
        label: "尚锦村委会",
      },
    ],
  },
  {
    value: "400",
    label: "江洋农场",
    children: [
      {
        value: "201",
        label: "江洋村委会",
      },
      {
        value: "202",
        label: "角洋村委会",
      },
      {
        value: "203",
        label: "武竹村委会",
      },
      {
        value: "204",
        label: "彭湖村委会",
      },
    ],
  },
];

function creatWmsLayer(option) {
  const { name, url, visible = true, index, CQL_FILTER, sld_body } = option;

  let layer,
    wmsParams = {
      SERVICE: "WMS",
      FORMAT: "image/png",
      VERSION: "1.1.0",
      transparent: true,
      LAYERS: name,
      CQL_FILTER,
      sld_body,
    };
  layer = new ImageLayer({
    visible: visible,
    zIndex: !index ? 12 : index,
    source: new ImageWMS({
      url,
      params: wmsParams,
    }),
  });
  layer.set("name", name);
  return layer;
}

function positiveView(url, $ol) {
  fetch(encodeURI(url))
    .then((response) => response.json())
    .then((data) => {
      const { features } = data;
      if (features && !!features.length) {
        // 视图定位
        const features = new GeoJSON().readFeatures(data);
        const vecSource = new VectorSource();
        vecSource.addFeatures(features);
        let extent = vecSource.getExtent();
        // 转投影
        $ol.olmap.map.getView().fit(extent, {
          // padding: [100, 50, 100, 50],
        });
      }
    });
}

export default {
  name: "HomeView",
  components: {
    BaseMap,
  },
  setup() {
    const instance = getCurrentInstance(),
      $ol = instance.appContext.config.globalProperties.$ol;

    let wmsLayer = null; // building
    let wmsLayerRegion = null; // region
    const value = ref(null);
    function change(value) {
      if (!value) {
        // 清除图层
        if (wmsLayer) {
          $ol.olmap.map.removeLayer(wmsLayer);
          wmsLayer = null;
          $ol.olmap.map.removeLayer(wmsLayerRegion);
          wmsLayerRegion = null;
        }
        return;
      }
      if (wmsLayer) {
        $ol.olmap.map.removeLayer(wmsLayer);
        wmsLayer = null;
        $ol.olmap.map.removeLayer(wmsLayerRegion);
        wmsLayerRegion = null;
      }
      // 加载wms图层
      let cql = `sn LIKE '${value.join("")}%'`;
      let cqlRegion = `WGBSM LIKE '${value.join("")}%'`;
      wmsLayer = creatWmsLayer({
        type: "wms",
        name: "fky:building",
        visible: true,
        url: "/geoserver/fky/wms",
        CQL_FILTER: cql,
        sld_body: `<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>building</Name>
    <UserStyle>
      <Title>A cyan polygon style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Title>cyan polygon</Title>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#0099cc</CssParameter>
              <CssParameter name="opacity">0.2</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#ffff00</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
			  <TextSymbolizer>
            <Label>
              <ogc:Function name="strSubstring">
               <ogc:PropertyName>sn</ogc:PropertyName>
              	<ogc:Literal>12</ogc:Literal>
               <ogc:Literal>14</ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">14</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>3</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
          	 </Halo>
          </TextSymbolizer>

        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
`,
      });
      $ol.olmap.map.addLayer(wmsLayer);
      wmsLayerRegion = creatWmsLayer({
        type: "wms",
        name: "fky:region",
        visible: true,
        url: "/geoserver/fky/wms",
        CQL_FILTER: cqlRegion,
        sld_body: `<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>region</Name>
    <UserStyle>
      <Title>A cyan polygon style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Title>cyan polygon</Title>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#0099cc</CssParameter>
              <CssParameter name="fill-opacity">0</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#00ff00</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#AAAAAA</CssParameter>
              <CssParameter name="stroke-width">0.2</CssParameter>
            </Stroke>
            <PerpendicularOffset>-2</PerpendicularOffset>
          </LineSymbolizer>
			  <TextSymbolizer>
            <Label>
              <ogc:PropertyName>WGMC</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">16</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
            	<Radius>1</Radius>
            	<Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            	</Fill>
          	 </Halo>
                <Fill>
              <CssParameter name="fill">#FF0000</CssParameter>
            	</Fill>
          </TextSymbolizer>

        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
`,
      });
      $ol.olmap.map.addLayer(wmsLayerRegion);
      // 请求定位
      const url = `/geoserver/fky/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=fky:building&maxFeatures=5000&outputFormat=application/json&cql_filter=${cql}&srsName=EPSG:4326`;
      positiveView(url, $ol);
    }

    onMounted(() => {
      // 地图定位到region图层
      const url = `/geoserver/fky/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=fky:region&maxFeatures=5000&outputFormat=application/json&srsName=EPSG:4326`;
      positiveView(url, $ol);
      // 添加zoomToExtent
    });
    return {
      mapTpl: olDefault,
      options,
      value,
      change,
    };
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  position: relative;

  .select-container {
    position: absolute;
    // width: 100%;
    z-index: 1;
    top: 0.5rem;
    left: 0.5rem;
  }
}
</style>
