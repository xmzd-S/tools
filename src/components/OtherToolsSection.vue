<template>
  <div class="other-tools-section">
    <div class="section-header">
      <h2>{{ sectionTitleComputed }}</h2>
    </div>
    <div class="tools-grid">
      <ToolCard
        v-for="tool in filteredTools"
        :key="tool.id"
        :tool="tool"
        @click="handleToolClick"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '../stores/toolStore';
import ToolCard from './ToolCard.vue';

interface Props {
  filteredTools: Tool[];
  popularTools: Tool[];
  favoriteTools: Tool[];
  searchKeyword: string;
}

const props = withDefaults(defineProps<Props>(), {
  filteredTools: () => [],
  popularTools: () => [],
  favoriteTools: () => [],
  searchKeyword: '',
});


// 过滤出既不是常用工具也不是收藏工具（在搜索时）的其他工具
const filteredTools = computed(() => {
  return props.filteredTools.filter(t => 
    !props.popularTools.some(p => p.id === t.id) && 
    (!props.searchKeyword || props.searchKeyword === '' || props.favoriteTools.some(f => f.id === t.id))
  );
});

const sectionTitleComputed = computed(() => {
  return props.searchKeyword ? '搜索结果' : '所有工具';
});

const handleToolClick = (tool: Tool) => {
  emit('tool-click', tool);
};

const handleToggleFavorite = (id: string) => {
  emit('toggle-favorite', id);
};

const emit = defineEmits<{
  (e: 'tool-click', tool: Tool): void;
  (e: 'toggle-favorite', id: string): void;
}>();

import { computed } from 'vue';
</script>

<style scoped>
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
</style>