/*
 * @Author: 张仕山
 * @Date: 2022-08-23 17:56:06
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-08-25 16:01:05
 * @Description:
 * @FilePath: \pure-project\vue-test\src\router\index.js
 */
import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
