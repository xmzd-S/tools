<template>
  <a-modal
    v-model:open="modalVisible"
    :title="selectedTool?.name"
    :footer="null"
    width="600px"
  >
    <div v-if="selectedTool" class="tool-detail">
      <p class="tool-desc">{{ selectedTool.description }}</p>
      <div class="detail-meta">
        <div class="meta-item">
          <span class="label">分类：</span>
          <span class="value">{{ selectedTool.category }}</span>
        </div>
        <div class="meta-item">
          <span class="label">使用次数：</span>
          <span class="value">{{ selectedTool.usageCount }}</span>
        </div>
        <div class="meta-item">
          <span class="label">收藏状态：</span>
          <a-switch
            :checked="selectedTool.isFavorite"
            @change="handleToggleFavorite"
          />
        </div>
      </div>
      <div class="tool-actions">
        <a-button type="primary" size="large">
          打开工具
        </a-button>
        <a-button @click="handleToggleFavoriteClick" size="large">
          {{ selectedTool.isFavorite ? '取消收藏' : '添加收藏' }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import type { Tool } from '../stores/toolStore';
import { ref, watch, computed } from 'vue';

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
  (e: 'toggle-favorite', id: string): void;
  (e: 'close'): void;
}>();

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

const handleToggleFavorite = () => {
  if (props.selectedTool) {
    emit('toggle-favorite', props.selectedTool.id);
  }
};

const handleToggleFavoriteClick = () => {
  if (props.selectedTool) {
    emit('toggle-favorite', props.selectedTool.id);
  }
};


</script>

<style scoped>
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
</style>