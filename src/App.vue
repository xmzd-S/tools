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
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  margin-bottom: 24px;
  padding: 0 20px;
}

.section-header {
  margin: 24px 0 16px;
  padding: 0 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 0 20px;
}

.tool-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tool-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-icon {
  margin-right: 8px;
  font-size: 16px;
}

.tool-description {
  color: #666;
  margin: 12px 0;
  line-height: 1.5;
}

.tool-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #999;
}

.category {
  background-color: #f0f5ff;
  color: #1d539d;
  padding: 2px 8px;
  border-radius: 4px;
}

.favorite {
  color: #ff4d4f !important;
}

.tool-detail .tool-desc {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: #333;
}

.detail-meta {
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  margin-bottom: 12px;
}

.meta-item .label {
  width: 80px;
  font-weight: 500;
  color: #666;
}

.meta-item .value {
  flex: 1;
  color: #333;
}

.tool-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .tool-actions {
    flex-direction: column;
  }
}
</style>