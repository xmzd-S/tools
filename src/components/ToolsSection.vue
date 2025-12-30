<template>
  <div class="other-tools-section">
    <div class="section-header">
      <h2>{{ sectionTitleComputed }}</h2>
    </div>
    <div class="tools-grid">
      <ToolCard
        v-for="tool in displayTools"
        :key="tool.id"
        :tool="tool"
        @click="handleToolClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Tool } from '../stores/toolStore';
import ToolCard from './ToolCard.vue';

interface Props {
  filteredTools: Tool[];
}

const props = withDefaults(defineProps<Props>(), {
  filteredTools: () => [],
});

// 直接显示所有过滤后的工具
const displayTools = computed(() => {
  return props.filteredTools;
});

const sectionTitleComputed = computed(() => {
  return '所有工具';
});

const handleToolClick = (tool: Tool) => {
  emit('tool-click', tool);
};

const emit = defineEmits<{
  (e: 'tool-click', tool: Tool): void;
}>();
</script>

<style scoped>
.other-tools-section {
  padding: 40px 0;
  position: relative;
}

.section-header {
  margin: 40px 0 24px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  position: relative;
}

.section-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.section-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 0 24px;
  position: relative;
}

.tools-grid::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .other-tools-section {
    padding: 24px 0;
  }

  .section-header {
    margin: 32px 0 20px;
    padding: 0 16px;
  }

  .section-header h2 {
    font-size: 24px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .section-header h2 {
    font-size: 20px;
  }

  .tools-grid {
    padding: 0 12px;
  }
}
</style>