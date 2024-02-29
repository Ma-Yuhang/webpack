<template>
  <div>
    <el-menu
      :default-active="routePath"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/user">用户列表</el-menu-item>
      <el-menu-item index="/image">照片</el-menu-item>
      <el-menu-item index="/counter">计算</el-menu-item>
      <el-menu-item index="/about">关于</el-menu-item>
    </el-menu>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const routePath = computed(() => route.path);
console.log("App.vue");
</script>

<style scoped>
</style>