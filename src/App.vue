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
  toolStore.setSelectedTool(tool);
  showToolDetail.value = true;
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



    <!-- 路由视图 -->
    <router-view 
      :handle-tool-click="handleToolClick"
    />

    <!-- 工具详情弹窗 -->
    <ToolDetailModal
      :selected-tool="toolStore.selectedTool"
      :visible="showToolDetail"
      @update:visible="showToolDetail = $event"
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


</style>
