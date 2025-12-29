<script setup lang="ts">
import { useToolStore } from './stores/toolStore';
import { ref } from 'vue';
import type { Tool } from './stores/toolStore';
import ToolDetailModal from './components/ToolDetailModal.vue';

const toolStore = useToolStore();

// 控制工具详情弹窗显示
const showToolDetail = ref(false);

// 处理工具点击事件
const handleToolClick = (tool: Tool) => {
  toolStore.incrementUsage(tool.id);
  toolStore.setSelectedTool(tool);
  showToolDetail.value = true;
};

// 处理收藏切换
const handleToggleFavorite = (id: string) => {
  toolStore.toggleFavorite(id);
};

// 搜索功能
const handleSearch = (value: string) => {
  toolStore.setSearchKeyword(value);
};

// 关闭详情弹窗
const closeDetail = () => {
  showToolDetail.value = false;
  toolStore.setSelectedTool(null);
};
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="nav-left">
        <h1>工具应用</h1>
      </div>
      <div class="nav-right">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于我们</router-link>
      </div>
    </div>

    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="toolStore.searchKeyword"
        placeholder="搜索工具名称、描述或分类..."
        size="large"
        @change="handleSearch"
        enter-button
      />
    </div>

    <!-- 路由视图 -->
    <router-view 
      :handle-tool-click="handleToolClick"
      :handle-toggle-favorite="handleToggleFavorite"
    />

    <!-- 工具详情弹窗 -->
    <ToolDetailModal
      :selected-tool="toolStore.selectedTool"
      :visible="showToolDetail"
      @update:visible="showToolDetail = $event"
      @toggle-favorite="handleToggleFavorite"
      @close="closeDetail"
    />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.nav-right {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.nav-link.router-link-active {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  font-weight: 600;
}

/* 搜索栏样式 */
.search-bar {
  margin: 32px auto;
  padding: 0 20px;
  max-width: 1200px;
  animation: searchBarSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(-20px);
}

/* 搜索栏滑入动画 */
@keyframes searchBarSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 搜索框悬停效果 */
:deep(.ant-input-search-large) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.ant-input-search-large:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

/* 搜索按钮动画 */
:deep(.ant-input-search-button) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.ant-input-search-button:hover) {
  transform: scale(1.05);
}

/* 输入框聚焦效果 */
:deep(.ant-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>
