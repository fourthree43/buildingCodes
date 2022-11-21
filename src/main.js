/*
 * @Author: 张仕山
 * @Date: 2022-08-23 17:56:06
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-19 23:54:45
 * @Description:
 * @FilePath: \src\main.js
 */
// import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Cascader } from "ant-design-vue";

const app = createApp(App);

app.use(Cascader);

app.config.globalProperties.$ol = { olmap: null };
app.use(store).use(router).mount("#app");
