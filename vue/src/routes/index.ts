import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(
      /* webpackChunkName:"HomeView" */
      /* webpackPreload:true */
      "@/views/HomeView.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import(
      /* webpackChunkName:"UserView" */
      /* webpackPrefetch:true */
      "@/views/UserView.vue"),
  },
  {
    path: "/image",
    name: "Image",
    component: () => import(
      /* webpackChunkName:"ImageView" */
      /* webpackPrefetch:true */
      "@/views/ImageView.vue"),
  },
  {
    path: "/counter",
    name: "Counter",
    component: () => import(
      /* webpackChunkName:"CounterView" */
      /* webpackPrefetch:true */
      "@/views/CounterView.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import(
      /* webpackChunkName:"AboutView" */
      /* webpackPrefetch:true */
      "@/views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
