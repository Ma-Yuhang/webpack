<template>
  <div>
    <p>count: {{ count }}</p>
    <button class="btn" @click="count ++">count</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue" 
const count = ref(0);
const show = () => { 
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("show");
    }, 2000);
  });
}
show().then((res) => {
  console.log(res);
});
</script>
<style scoped lang="scss">
/* @import "@/assets/styles/variables.scss"; */
.btn{
  border-radius: $borderRadius;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  &:hover {
    border-color: $borderColor;
    transform: scale(1.05, 1.05);
  }
  &:focus,
  &:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
}
/* .btn:hover {
  border-color: #646cff;
}
.btn:focus,
.bnt:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
} */
</style>
