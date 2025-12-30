<script setup lang="ts">
import { useToolStore } from './stores/toolStore';
import { ref } from 'vue';
import type { Tool } from './stores/toolStore';
import { TOOL_ID_JSON_FORMATTER, TOOL_ID_AI_CHAT } from './stores/toolStore';
import JSONFormatter from './components/JSONFormatter.vue';
import AIChat from './components/AIChat.vue';

const toolStore = useToolStore();

// 控制功能组件显示
const showJSONFormatter = ref(false);
const showAIChat = ref(false);

// 处理工具点击事件，直接打开功能
const handleToolClick = (tool: Tool) => {
  if (tool.id === TOOL_ID_JSON_FORMATTER) {
    showJSONFormatter.value = true;
  } else if (tool.id === TOOL_ID_AI_CHAT) {
    showAIChat.value = true;
  }
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

    <!-- JSON格式化工具模态框 -->
    <a-modal
      v-model:open="showJSONFormatter"
      title="JSON格式化工具"
      :footer="null"
      width="900px"
      body-style="padding: 20px"
    >
      <JSONFormatter />
    </a-modal>

    <!-- AI聊天工具模态框 -->
    <a-modal
      v-model:open="showAIChat"
      title="AI聊天工具"
      :footer="null"
      width="900px"
      body-style="padding: 20px"
    >
      <AIChat />
    </a-modal>
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
