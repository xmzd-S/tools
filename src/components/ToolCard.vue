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
      <span class="category">{{ tool.category }}</span>
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
</style>