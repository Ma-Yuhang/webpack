<template>
  <div>
    <div class="img__container">
      <!-- 如果是一个绝对路径，webpack不会处理这个路径 -->
      <!-- <img src="/src/assets/images/1.jpg" alt="1.jpg"> -->
      <img src="../assets/images/1.jpg" alt="1.jpg" />
      <img src="@/assets/images/2.jpg" alt="2.jpg" />
      <img :src="month3" alt="3.jpg" />
      <img :src="imgPath" alt="4.jpg" />
      <img src="../assets/images/Webpack.svg" alt="Webpack.svg" />
    </div>

    <ul>
      <li><span class="iconfont">&#xe704;</span></li>
      <li><span class="iconfont">&#xe6a3;</span></li>
      <li><span class="iconfont">&#xe639;</span></li>
      <li><span class="iconfont">&#xe64d;</span></li>
      <li><span class="iconfont">&#xe891;</span></li>
    </ul>

    <div class="img__container">
      <img
        v-for="img in images"
        :key="img.id"
        :alt="img.alt"
        v-img-lazy="imgUrl(img.src)"
        src="@/assets/images/img_not_found.png"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import month3 from "@/assets/images/3.jpg";

const imgName = "4.jpg";
const imgPath = require(`@/assets/images/${imgName}`);

const images = [
  { id: 1, src: "1.jpg", alt: "1.jpg" },
  { id: 2, src: "2.jpg", alt: "2.jpg" },
  { id: 3, src: "3.jpg", alt: "3.jpg" },
  { id: 4, src: "4.jpg", alt: "4.jpg" },
  { id: 5, src: "5.jpg", alt: "5.jpg" },
  { id: 6, src: "6.jpg", alt: "6.jpg" },
  { id: 7, src: "7.jpg", alt: "7.jpg" },
  { id: 8, src: "8.jpg", alt: "8.jpg" },
  { id: 9, src: "9.jpg", alt: "9.jpg" },
  { id: 10, src: "10.jpg", alt: "10.jpg" },
  { id: 11, src: "11.jpg", alt: "11.jpg" },
  { id: 12, src: "12.jpg", alt: "12.jpg" },
];

const imgUrl = computed(
  () => (filename: string) => loadImage(filename)
);

const loadImage = (filename: string) => {
  try { 
    return require(`@/assets/images/${filename}`);
  } catch (error) {
    console.error(error)
    return require(`@/assets/images/404.png`);
  }
}
</script>

<style scoped lang="scss">
.img__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  img {
    width: 340px;
    height: 200px;
    margin: 16px;
  }
}
</style>
