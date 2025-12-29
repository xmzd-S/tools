<script setup lang="ts">
import { ref } from 'vue';
import { useToolStore } from './stores/toolStore';
import type { Tool } from './stores/toolStore';
import PopularToolsSection from './components/PopularToolsSection.vue';
import FavoriteToolsSection from './components/FavoriteToolsSection.vue';
import OtherToolsSection from './components/OtherToolsSection.vue';
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
  <div class="toolkit-container">
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

    <!-- 常用工具部分 -->
    <PopularToolsSection
      :popular-tools="toolStore.popularTools"
      section-title="常用工具"
      @tool-click="handleToolClick"
      @toggle-favorite="handleToggleFavorite"
    />

    <!-- 收藏工具部分 -->
    <FavoriteToolsSection
      :favorite-tools="toolStore.favoriteTools"
      :popular-tools="toolStore.popularTools"
      :search-keyword="toolStore.searchKeyword"
      section-title="收藏工具"
      @tool-click="handleToolClick"
      @toggle-favorite="handleToggleFavorite"
    />

    <!-- 其他工具部分 -->
    <OtherToolsSection
      :filtered-tools="toolStore.filteredTools"
      :popular-tools="toolStore.popularTools"
      :favorite-tools="toolStore.favoriteTools"
      :search-keyword="toolStore.searchKeyword"
      @tool-click="handleToolClick"
      @toggle-favorite="handleToggleFavorite"
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
.toolkit-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
}

/* 搜索栏样式 */
.search-bar {
  margin-bottom: 32px;
  padding: 0 20px;
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

.section-header {
  margin: 32px 0 16px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  animation: sectionHeaderFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s;
  opacity: 0;
}

/* 区域标题淡入动画 */
@keyframes sectionHeaderFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

/* 区域标题悬停效果 */
.section-header h2:hover {
  filter: brightness(1.1);
  text-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}
</style>