<script setup lang="ts">
import { ref } from 'vue';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons-vue';

const mobileMenuVisible = ref(false);

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

const closeMobileMenu = () => {
  mobileMenuVisible.value = false;
};
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="nav-left">
        <h1>博客系统</h1>
      </div>
      <div class="nav-right desktop-nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/dashboard" class="nav-link">控制台</router-link>
        <router-link to="/blog" class="nav-link">博客文章</router-link>
        <router-link to="/categories" class="nav-link">分类管理</router-link>
        <router-link to="/tools" class="nav-link">工具</router-link>
        <router-link to="/about" class="nav-link">关于我们</router-link>
      </div>
      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        <MenuOutlined v-if="!mobileMenuVisible" />
        <CloseOutlined v-else />
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu-overlay" :class="{ active: mobileMenuVisible }" @click="closeMobileMenu"></div>
    <div class="mobile-menu" :class="{ active: mobileMenuVisible }">
      <div class="mobile-menu-content">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="link-icon">🏠</span>
          <span>首页</span>
        </router-link>
        <router-link to="/dashboard" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="link-icon">📊</span>
          <span>控制台</span>
        </router-link>
        <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="link-icon">📝</span>
          <span>博客文章</span>
        </router-link>
        <router-link to="/categories" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="link-icon">📁</span>
          <span>分类管理</span>
        </router-link>
        <router-link to="/tools" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="link-icon">🔧</span>
          <span>工具</span>
        </router-link>
        <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="link-icon">ℹ️</span>
          <span>关于我们</span>
        </router-link>
      </div>
    </div>



    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
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

/* 导航栏样式 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-left h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.nav-right {
  display: flex;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px;
  border-radius: 12px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.mobile-menu-btn {
  display: none;
  font-size: 24px;
  color: #667eea;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
}

.mobile-menu-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 998;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -320px;
  width: 280px;
  height: 100%;
  background: white;
  z-index: 999;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 80px 24px 24px;
  gap: 8px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: #334155;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: slideInRight 0.3s ease forwards;
  opacity: 0;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-nav-link:nth-child(1) { animation-delay: 0.05s; }
.mobile-nav-link:nth-child(2) { animation-delay: 0.1s; }
.mobile-nav-link:nth-child(3) { animation-delay: 0.15s; }
.mobile-nav-link:nth-child(4) { animation-delay: 0.2s; }
.mobile-nav-link:nth-child(5) { animation-delay: 0.25s; }
.mobile-nav-link:nth-child(6) { animation-delay: 0.3s; }

.mobile-nav-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: translateX(-4px);
}

.mobile-nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.link-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-left h1 {
    font-size: 22px;
  }

  .nav-bar {
    padding: 12px 20px;
  }
}

/* 模态框样式优化 */
:deep(.ant-modal) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
}

:deep(.ant-modal-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  padding: 20px 24px;
}

:deep(.ant-modal-title) {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

:deep(.ant-modal-close-x) {
  color: white;
  font-size: 20px;
}

:deep(.ant-modal-close-x:hover) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.ant-modal-body) {
  padding: 24px;
}
</style>
