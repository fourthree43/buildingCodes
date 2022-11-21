<!--
 * @Author: 张仕山
 * @Date: 2022-08-23 17:56:06
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-08-24 17:19:48
 * @Description:  
 * @FilePath: \pure-project\vue-test\src\views\AboutView.vue
-->
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <img :src="img" :style="'object-fit: contain; width: 100%;'" />
  </div>
</template>
<script>
import img from "@/assets/登录页.png";
export default {
  setup() {
    return {
      img,
    };
  },
};
</script>
