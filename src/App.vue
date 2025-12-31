<template>
  <div class="app-container">
    <div class="nav-bar">
      <div class="nav-left">
        <h1>博客系统</h1>
      </div>
      <div class="nav-right">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/dashboard" class="nav-link">控制台</router-link>
        <router-link to="/blog" class="nav-link">博客文章</router-link>
        <router-link to="/categories" class="nav-link">分类管理</router-link>
        <router-link to="/tools" class="nav-link">工具</router-link>
        <router-link to="/about" class="nav-link">关于我们</router-link>
        
        <div class="auth-section">
          <!-- 已登录状态 -->
          <div v-if="authStore.isAuthenticated" class="user-profile">
            <span class="username">{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="logout-button">登出</button>
          </div>
          
          <!-- 未登录状态 -->
          <router-link v-else to="/login" class="nav-link login-button">登录</router-link>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();

// 处理登出
const handleLogout = async () => {
  await authStore.logout();
};
</script>

<style scoped>
.app-container {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --shadow-primary: 0 4px 12px rgba(102, 126, 234, 0.3);
  --shadow-active: 0 4px 12px rgba(102, 126, 234, 0.4);
  --color-white: white;
  
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 50%, #eef2f6 100%);
  color: #1e293b;
  position: relative;
  overflow-x: hidden;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-left h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.nav-right {
  display: flex;
  gap: 8px;
  background: rgba(102, 126, 234, 0.06);
  padding: 6px;
  border-radius: 12px;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 12px;
  border-radius: 10px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.logout-button {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  font-weight: 600;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--color-white);
  background: var(--gradient-primary);
  font-weight: 600;
  box-shadow: var(--shadow-active);
}

:deep(.ant-modal) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
}

:deep(.ant-modal-header) {
  background: var(--gradient-primary);
  border-bottom: none;
  padding: 20px 24px;
}

:deep(.ant-modal-title) {
  color: var(--color-white);
  font-size: 20px;
  font-weight: 600;
}

:deep(.ant-modal-close-x) {
  color: var(--color-white);
  font-size: 20px;
}

:deep(.ant-modal-close-x:hover) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.ant-modal-body) {
  padding: 24px;
}
</style>
