import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from './router';
import { useAuthStore } from './stores/authStore';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
const pinia = createPinia();

// 初始化应用
async function initApp() {
  // 使用pinia
  app.use(pinia);
  
  // 初始化认证状态
  const authStore = useAuthStore();
  await authStore.initAuth();
  
  // 使用路由
  app.use(router);
  
  // 挂载应用
  app.mount("#app");
}

// 启动应用
initApp();
