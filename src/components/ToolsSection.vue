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
.section-header {
  margin: 32px 0 16px;
  padding: 0 20px;
  display: flex;
  align-items: center;
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
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 20px;
}
</style>