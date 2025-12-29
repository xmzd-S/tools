<template>
  <div class="favorite-tools-section" v-if="favoriteTools.length > 0 && searchKeyword === ''">
    <div class="section-header">
      <h2>{{ sectionTitle }}</h2>
    </div>
    <div class="tools-grid">
      <ToolCard
        v-for="tool in filteredFavoriteTools"
        :key="tool.id"
        :tool="tool"
        @click="handleToolClick"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Tool } from '../stores/toolStore';
import ToolCard from './ToolCard.vue';

interface Props {
  favoriteTools: Tool[];
  popularTools: Tool[];
  searchKeyword: string;
  sectionTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  favoriteTools: () => [],
  popularTools: () => [],
  searchKeyword: '',
  sectionTitle: '收藏工具',
});

const emit = defineEmits<{
  (e: 'tool-click', tool: Tool): void;
  (e: 'toggle-favorite', id: string): void;
}>();

// 过滤出不是常用工具的收藏工具
const filteredFavoriteTools = computed(() => {
  return props.favoriteTools.filter(t => 
    !props.popularTools.some(p => p.id === t.id)
  );
});

const handleToolClick = (tool: Tool) => {
  emit('tool-click', tool);
};

const handleToggleFavorite = (id: string) => {
  emit('toggle-favorite', id);
};
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