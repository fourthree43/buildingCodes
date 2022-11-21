<!--
 * @Author: 张仕山
 * @Date: 2022-08-23 17:56:06
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-19 22:36:50
 * @Description:  
 * @FilePath: \src\App.vue
-->
<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view />
</template>

<style>
@import "ant-design-vue/dist/antd.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
}
</style>
