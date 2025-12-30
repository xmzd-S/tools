<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToolStore } from '../stores/toolStore';
import { TOOL_ID_JSON_FORMATTER, TOOL_ID_AI_CHAT } from '../stores/toolStore';
import JSONFormatter from '../components/JSONFormatter.vue';
import AIChat from '../components/AIChat.vue';
import {
  SearchOutlined,
  FileTextOutlined,
  MessageOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue';

const toolStore = useToolStore();

const searchKeyword = ref('');
const viewMode = ref<'grid' | 'list'>('grid');
const selectedCategory = ref<string>('all');

const showJSONFormatter = ref(false);
const showAIChat = ref(false);

const categories = computed(() => ['all', ...toolStore.categories]);

const filteredTools = computed(() => {
  let tools = toolStore.tools;

  if (selectedCategory.value !== 'all') {
    tools = tools.filter(tool => tool.category === selectedCategory.value);
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase();
    tools = tools.filter(tool =>
      tool.name.toLowerCase().includes(keyword) ||
      tool.description.toLowerCase().includes(keyword)
    );
  }

  return tools;
});

const handleSearch = (value: string) => {
  searchKeyword.value = value;
};

const handleToolClick = (toolId: string) => {
  if (toolId === TOOL_ID_JSON_FORMATTER) {
    showJSONFormatter.value = true;
  } else if (toolId === TOOL_ID_AI_CHAT) {
    showAIChat.value = true;
  }
};

const getToolIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'file-text': FileTextOutlined,
    'message': MessageOutlined
  };
  return iconMap[iconName] || FileTextOutlined;
};
</script>

<template>
  <div class="tools-container">
    <div class="tools-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🔧</span>
          工具箱
        </h1>
        <p class="page-description">探索和使用各种实用工具</p>
      </div>
      
      <div class="header-actions">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索工具..."
          size="large"
          style="width: 300px"
          @search="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>
        
        <a-radio-group v-model:value="viewMode" button-style="solid" size="large">
          <a-radio-button value="grid">
            <AppstoreOutlined />
          </a-radio-button>
          <a-radio-button value="list">
            <BarsOutlined />
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <div class="tools-content">
      <div class="sidebar">
        <div class="category-filter">
          <h3 class="filter-title">分类筛选</h3>
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category"
              :class="['category-item', { active: selectedCategory === category }]"
              @click="selectedCategory = category"
            >
              <span class="category-name">
                {{ category === 'all' ? '全部工具' : category }}
              </span>
              <span class="category-count">
                {{ category === 'all' ? toolStore.tools.length : toolStore.toolsByCategory[category]?.length || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="tools-main">
        <div v-if="filteredTools.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <p class="empty-text">没有找到匹配的工具</p>
        </div>

        <div v-else-if="viewMode === 'grid'" class="tools-grid">
          <div
            v-for="tool in filteredTools"
            :key="tool.id"
            class="tool-card"
            @click="handleToolClick(tool.id)"
          >
            <div class="tool-icon">
              <component :is="getToolIcon(tool.icon)" />
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-description">{{ tool.description }}</p>
              <div class="tool-meta">
                <span class="tool-category">{{ tool.category }}</span>
                <ArrowRightOutlined class="tool-arrow" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="tools-list">
          <div
            v-for="tool in filteredTools"
            :key="tool.id"
            class="tool-list-item"
            @click="handleToolClick(tool.id)"
          >
            <div class="tool-list-icon">
              <component :is="getToolIcon(tool.icon)" />
            </div>
            <div class="tool-list-info">
              <h3 class="tool-list-name">{{ tool.name }}</h3>
              <p class="tool-list-description">{{ tool.description }}</p>
            </div>
            <div class="tool-list-meta">
              <span class="tool-list-category">{{ tool.category }}</span>
              <ArrowRightOutlined class="tool-list-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="showJSONFormatter"
      title="JSON格式化工具"
      :footer="null"
      width="900px"
      body-style="padding: 20px"
    >
      <JSONFormatter />
    </a-modal>

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
.tools-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 50%, #eef2f6 100%);
  padding: 32px 0;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.tools-header {
  max-width: 1400px;
  margin: 0 auto 32px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 40px;
  -webkit-text-fill-color: initial;
}

.page-description {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.tools-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
}

.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.category-filter {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
}

.category-filter:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px;
  color: #1e293b;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.category-item:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(-4px);
}

.category-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.category-item.active::before {
  opacity: 1;
}

.category-name,
.category-count {
  position: relative;
  z-index: 1;
  font-weight: 500;
}

.category-count {
  background: rgba(102, 126, 234, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.category-item.active .category-count {
  background: rgba(255, 255, 255, 0.2);
}

.tools-main {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease-out;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  color: #64748b;
  margin: 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.tool-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
  pointer-events: none;
}

.tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-card:hover .tool-icon {
  transform: scale(1.2) rotate(5deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tool-card:hover .tool-arrow {
  transform: translateX(4px);
  color: #667eea;
}

.tool-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  font-size: 28px;
  color: #667eea;
  margin-bottom: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.tool-info {
  position: relative;
  z-index: 1;
}

.tool-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #1e293b;
}

.tool-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
  line-height: 1.6;
}

.tool-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-category {
  font-size: 12px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.tool-arrow {
  font-size: 16px;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-list-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
  animation: fadeInLeft 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(30px);
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tool-list-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
  pointer-events: none;
}

.tool-list-item:hover {
  transform: translateX(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.tool-list-item:hover::before {
  opacity: 1;
}

.tool-list-item:hover .tool-list-icon {
  transform: scale(1.2) rotate(5deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tool-list-item:hover .tool-list-arrow {
  transform: translateX(4px);
  color: #667eea;
}

.tool-list-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 14px;
  font-size: 24px;
  color: #667eea;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.tool-list-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.tool-list-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1e293b;
}

.tool-list-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.tool-list-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.tool-list-category {
  font-size: 12px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.tool-list-arrow {
  font-size: 16px;
  color: #94a3b8;
  transition: all 0.3s ease;
}

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
