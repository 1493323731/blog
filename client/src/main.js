import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import naive from "naive-ui";
import { createDiscreteApi } from "naive-ui";
import { createPinia } from "pinia";
import { router } from "./common/router";
import axios from "axios";
import { AdminStore } from "./stores/AdminStore";

//服务端地址
axios.defaults.baseURL = "http://localhost:8080";
// naive-ui独立API
const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);

const app = createApp(App);
// 使axios全局可用;
app.provide("axios", axios);
app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);
app.provide("server_url", axios.defaults.baseURL);

app.use(createPinia());
app.use(naive);
app.use(router);
const adminStore = AdminStore();
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
});
app.mount("#app");
