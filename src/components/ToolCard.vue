<template>
  <a-card
    hoverable
    class="tool-card"
    @click="handleClick"
  >
    <template #title>
      <div class="tool-title">
        <span class="tool-icon">
          <component :is="getIconComponent(tool.icon)" v-if="tool.icon" />
          <span v-else>🧰</span>
        </span>
        <span>{{ tool.name }}</span>
        <a-button
          type="text"
          @click.stop="toggleFavorite"
          :class="{ 'favorite': tool.isFavorite }"
        >
          <template #icon>
            <HeartFilled v-if="tool.isFavorite" />
            <HeartOutlined v-else />
          </template>
        </a-button>
      </div>
    </template>
    <p class="tool-description">{{ tool.description }}</p>
    <div class="tool-meta">
      <span class="category" :title="tool.category">{{ tool.category }}</span>
      <span class="usage-count">使用 {{ tool.usageCount }} 次</span>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue';
import type { Tool } from '../stores/toolStore';

interface Props {
  tool: Tool;
}

interface Emits {
  (e: 'click', tool: Tool): void;
  (e: 'toggle-favorite', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click', props.tool);
};

const toggleFavorite = () => {
  emit('toggle-favorite', props.tool.id);
};

// 根据图标名称返回对应的图标组件
const getIconComponent = (iconName: string) => {
  // 这里可以根据需要扩展图标映射
  const iconMap: Record<string, any> = {
    code: 'CodeOutlined',
    'bg-colors': 'BgColorsOutlined',
    'file-text': 'FileTextOutlined',
    picture: 'PictureOutlined',
    diff: 'DiffOutlined',
    'clock-circle': 'ClockCircleOutlined',
    key: 'KeyOutlined',
    qrcode: 'QrcodeOutlined',
  };
  
  return iconMap[iconName] || 'AppstoreOutlined';
};
</script>

<style scoped>
/* 卡片基础样式 */
.tool-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  will-change: transform, box-shadow;
}

/* 卡片进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片悬停效果增强 */
.tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 15px 15px -10px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}

/* 卡片点击效果 */
.tool-card:active {
  transform: translateY(-4px) scale(0.99);
  transition: all 0.1s ease;
}

.tool-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tool-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #3b82f6;
  transition: all 0.3s ease;
}

/* 卡片悬停时图标放大 */
.tool-card:hover .tool-icon {
  transform: scale(1.1);
}

.tool-description {
  color: #64748b;
  margin: 12px 0;
  line-height: 1.6;
  font-size: 14px;
  transition: color 0.3s ease;
}

/* 卡片悬停时描述文字颜色加深 */
.tool-card:hover .tool-description {
  color: #475569;
}

.tool-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
  color: #94a3b8;
}

.category {
  background-color: #eff6ff;
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 分类标签悬停效果 */
.category:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 根据不同分类使用不同颜色 */
.category[title="开发工具"] {
  background-color: #eff6ff;
  color: #2563eb;
}

.category[title="设计工具"] {
  background-color: #fef3c7;
  color: #d97706;
}

.category[title="效率工具"] {
  background-color: #d1fae5;
  color: #059669;
}

.category[title="实用工具"] {
  background-color: #e0e7ff;
  color: #6366f1;
}

.category[title="学习工具"] {
  background-color: #fbcfe8;
  color: #ec4899;
}

.category[title="其他"] {
  background-color: #f3f4f6;
  color: #6b7280;
}

.usage-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* 卡片悬停时使用次数颜色变化 */
.tool-card:hover .usage-count {
  color: #64748b;
}

.favorite {
  color: #ff4d4f !important;
  transition: all 0.2s;
}

/* 收藏按钮动画 */
.favorite:hover {
  transform: scale(1.3);
  filter: drop-shadow(0 0 8px rgba(255, 77, 79, 0.4));
}

/* 收藏按钮点击动画 */
.favorite:active {
  transform: scale(0.95);
}

/* 未收藏按钮悬停效果 */
:deep(.ant-btn):not(.favorite):hover {
  background-color: rgba(255, 77, 79, 0.05);
  transform: scale(1.2);
}

/* 改进按钮样式 */
:deep(.ant-btn) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* 心形图标动画 */
:deep(.anticon-heart) {
  transition: all 0.3s ease;
}

/* 卡片标题区域 */
.tool-title {
  transition: all 0.3s ease;
}

/* 卡片悬停时标题颜色变化 */
.tool-card:hover .tool-title span:not(.tool-icon) {
  color: #3b82f6;
}
</style>