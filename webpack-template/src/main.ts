// import "core-js/stable";
// import 'regenerator-runtime/runtime'
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from './routes'
import directives from "@/directives/index";

createApp(App).use(directives).use(router).mount("#app");