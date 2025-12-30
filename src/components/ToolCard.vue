<template>
  <a-card
    hoverable
    class="tool-card"
    @click="handleClick"
  >
    <template #title>
      <div class="tool-title">
        <div class="tool-icon-wrapper">
          <span class="tool-icon">
            <component :is="getIconComponent(tool.icon)" v-if="tool.icon" />
            <span v-else>🧰</span>
          </span>
        </div>
        <span class="tool-name">{{ tool.name }}</span>
      </div>
    </template>
    <p class="tool-description">{{ tool.description }}</p>
    <div class="tool-meta">
      <span class="category" :title="tool.category">{{ tool.category }}</span>
      <div class="tool-arrow">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import * as Icons from '@ant-design/icons-vue';
import type { Tool } from '../stores/toolStore';

interface Props {
  tool: Tool;
}

interface Emits {
  (e: 'click', tool: Tool): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click', props.tool);
};

// 根据图标名称返回对应的图标组件
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    code: Icons.CodeOutlined,
    'bg-colors': Icons.BgColorsOutlined,
    'file-text': Icons.FileTextOutlined,
    picture: Icons.PictureOutlined,
    diff: Icons.DiffOutlined,
    'clock-circle': Icons.ClockCircleOutlined,
    key: Icons.KeyOutlined,
    qrcode: Icons.QrcodeOutlined,
    message: Icons.MessageOutlined,
  };
  
  return iconMap[iconName] || Icons.AppstoreOutlined;
};
</script>

<style scoped>
/* 卡片基础样式 */
.tool-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, box-shadow;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.tool-card:hover::before {
  opacity: 1;
}

/* 卡片进入动画 */
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

/* 卡片悬停效果增强 */
.tool-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 30px 60px -12px rgba(102, 126, 234, 0.3), 0 20px 20px -10px rgba(118, 75, 162, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

/* 卡片点击效果 */
.tool-card:active {
  transform: translateY(-6px) scale(0.98);
  transition: all 0.1s ease;
}

.tool-title {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.tool-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tool-icon-wrapper::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg) translateX(-100%);
  transition: transform 0.6s ease;
}

.tool-card:hover .tool-icon-wrapper::before {
  transform: rotate(45deg) translateX(100%);
}

.tool-card:hover .tool-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.tool-icon {
  font-size: 24px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  transition: all 0.3s ease;
}

.tool-card:hover .tool-name {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tool-description {
  color: #64748b;
  margin: 16px 0;
  line-height: 1.7;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.tool-card:hover .tool-description {
  color: #475569;
}

.tool-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  font-size: 12px;
  color: #94a3b8;
  position: relative;
  z-index: 1;
}

.category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.category::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.category:hover::before {
  left: 100%;
}

.category:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.tool-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #667eea;
}

.tool-arrow svg {
  width: 18px;
  height: 18px;
  transition: all 0.3s ease;
}

.tool-card:hover .tool-arrow {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tool-card:hover .tool-arrow svg {
  transform: translateX(2px);
}

/* Ant Design Card 样式覆盖 */
:deep(.ant-card-head) {
  border-bottom: none;
  padding: 20px 24px 12px;
}

:deep(.ant-card-head-title) {
  padding: 0;
}

:deep(.ant-card-body) {
  padding: 0 24px 24px;
}
</style>