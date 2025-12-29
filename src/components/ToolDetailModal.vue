<template>
  <a-modal
    v-model:open="modalVisible"
    :title="null"
    :footer="null"
    width="600px"
    :body-style="{ padding: 0, borderRadius: '12px', overflow: 'hidden' }"
    :transition-name="'zoom-fade'"
    :mask-transition-name="'fade'"
  >
    <div v-if="selectedTool" class="tool-detail">
      <!-- 头部区域 -->
      <div class="tool-detail-header" :class="getCategoryClass(selectedTool.category)">
        <div class="tool-icon">
          <component :is="getIconComponent(selectedTool.icon)" v-if="selectedTool.icon" />
          <span v-else>🧰</span>
        </div>
        <div class="tool-header-content">
          <h2 class="tool-name">{{ selectedTool.name }}</h2>
          <div class="tool-category">{{ selectedTool.category }}</div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="tool-detail-body">
        <p class="tool-desc">{{ selectedTool.description }}</p>
        
        <div class="detail-meta">
          <div class="meta-item">
            <span class="label">分类：</span>
            <span class="value category-tag" :title="selectedTool.category">{{ selectedTool.category }}</span>
          </div>
        </div>
        
        <div class="tool-actions">
          <a-button type="primary" size="large" class="action-btn" @click="handleOpenTool">
            打开工具
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>

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
</template>

<script setup lang="ts">
import type { Tool } from '../stores/toolStore';
import { TOOL_ID_JSON_FORMATTER } from '../stores/toolStore';
import { ref, watch, computed } from 'vue';
import * as Icons from '@ant-design/icons-vue';
import JSONFormatter from './JSONFormatter.vue';

interface Props {
  selectedTool: Tool | null;
  visible: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedTool: null,
  visible: false,
});

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
}>();

// 控制JSON格式化工具是否显示
const showJSONFormatter = ref(false);

// 使用计算属性来控制模态框的显示
const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
    if (!value) {
      emit('close');
    }
  }
});

// 根据图标名称返回对应的图标组件
const getIconComponent = (iconName: string) => {
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
  
  const componentName = iconMap[iconName] || 'AppstoreOutlined';
  return Icons[componentName as keyof typeof Icons];
};

// 根据分类返回对应的样式类
const getCategoryClass = (category: string) => {
  const categoryMap: Record<string, string> = {
    '开发工具': 'category-development',
    '设计工具': 'category-design',
    '效率工具': 'category-productivity',
    '实用工具': 'category-utility',
    '学习工具': 'category-education',
    '其他': 'category-other'
  };
  
  return categoryMap[category] || 'category-other';
};

// 处理打开工具按钮点击
const handleOpenTool = () => {
  if (props.selectedTool?.id === TOOL_ID_JSON_FORMATTER) { // JSON格式化工具的ID
    showJSONFormatter.value = true;
  }
};
</script>

<style scoped>
/* 模态框内容容器 */
.tool-detail {
  overflow: hidden;
  border-radius: 12px;
  animation: modalContentFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: scale(0.95);
}

/* 模态框内容淡入动画 */
@keyframes modalContentFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 头部区域样式 */
.tool-detail-header {
  padding: 32px;
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: headerSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.1s;
  opacity: 0;
  transform: translateX(-20px);
}

/* 头部区域滑入动画 */
@keyframes headerSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 头部悬停效果 */
.tool-detail-header:hover {
  filter: brightness(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 分类颜色样式 */
.tool-detail-header.category-development {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.tool-detail-header.category-design {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.tool-detail-header.category-productivity {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.tool-detail-header.category-utility {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

.tool-detail-header.category-education {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.tool-detail-header.category-other {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.tool-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
  animation: iconBounceIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s;
  opacity: 0;
  transform: scale(0.8);
}

/* 图标弹跳动画 */
@keyframes iconBounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 头部内容 */
.tool-header-content {
  flex: 1;
  animation: contentSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.3s;
  opacity: 0;
  transform: translateX(20px);
}

/* 头部内容滑入动画 */
@keyframes contentSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tool-name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tool-category {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 内容区域样式 */
.tool-detail-body {
  padding: 32px;
  background-color: white;
  animation: bodyFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.4s;
  opacity: 0;
  transform: translateY(20px);
}

/* 内容区域淡入动画 */
@keyframes bodyFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-desc {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 28px;
  color: #475569;
  transition: color 0.3s ease;
}

/* 元数据区域 */
.detail-meta {
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

/* 元数据悬停效果 */
.detail-meta:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.meta-item {
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: all 0.2s ease;
}

/* 元数据项悬停效果 */
.meta-item:hover {
  background-color: white;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-item .label {
  width: 100px;
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
  transition: color 0.3s ease;
}

.meta-item .value {
  flex: 1;
  color: #1e293b;
  font-size: 14px;
  transition: color 0.3s ease;
}

/* 分类标签样式 */
.category-tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 分类标签悬停效果 */
.category-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 根据不同分类使用不同颜色 */
.category-tag[title="开发工具"] {
  background-color: #eff6ff;
  color: #2563eb;
}

.category-tag[title="设计工具"] {
  background-color: #fef3c7;
  color: #d97706;
}

.category-tag[title="效率工具"] {
  background-color: #d1fae5;
  color: #059669;
}

.category-tag[title="实用工具"] {
  background-color: #e0e7ff;
  color: #6366f1;
}

.category-tag[title="学习工具"] {
  background-color: #fbcfe8;
  color: #ec4899;
}

.category-tag[title="其他"] {
  background-color: #f3f4f6;
  color: #6b7280;
}

/* 按钮区域样式 */
.tool-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
}

/* 主按钮样式 */
.action-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  animation: buttonFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.5s;
  opacity: 0;
  transform: translateY(10px);
}

/* 收藏按钮样式 */
.favorite-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  animation: buttonFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.6s;
  opacity: 0;
  transform: translateY(10px);
}

/* 按钮淡入动画 */
@keyframes buttonFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 主按钮悬停效果 */
.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
}

/* 收藏按钮悬停效果 */
.favorite-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(255, 77, 79, 0.2);
}

/* 收藏按钮激活状态 */
.favorite-btn:has(.anticon-heart) {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

/* 开关样式 */
:deep(.ant-switch) {
  margin-left: 12px;
  transition: all 0.3s ease;
}

/* 开关悬停效果 */
:deep(.ant-switch):hover {
  transform: scale(1.05);
}

/* 按钮点击效果 */
.action-btn:active,
.favorite-btn:active {
  transform: translateY(-2px) scale(0.98);
  transition: all 0.1s ease;
}

/* 自定义模态框过渡动画 */
:deep(.zoom-fade-enter-active),
:deep(.zoom-fade-leave-active) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.zoom-fade-enter-from),
:deep(.zoom-fade-leave-to) {
  opacity: 0;
  transform: scale(0.9);
}

:deep(.fade-enter-active),
:deep(.fade-leave-active) {
  transition: opacity 0.3s ease;
}

:deep(.fade-enter-from),
:deep(.fade-leave-to) {
  opacity: 0;
}
</style>