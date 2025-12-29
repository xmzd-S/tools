<template>
  <div class="home">
    <PopularToolsSection
      :popular-tools="toolStore.popularTools"
      @tool-click="handleToolClick"
      @toggle-favorite="handleToggleFavorite"
    />
    <FavoriteToolsSection
      :favorite-tools="toolStore.favoriteTools"
      :popular-tools="toolStore.popularTools"
      @tool-click="handleToolClick"
      @toggle-favorite="handleToggleFavorite"
    />
    <OtherToolsSection
      :filtered-tools="toolStore.filteredTools"
      :popular-tools="toolStore.popularTools"
      :favorite-tools="toolStore.favoriteTools"
      @tool-click="handleToolClick"
      @toggle-favorite="handleToggleFavorite"
    />
  </div>
</template>

<script setup lang="ts">
import PopularToolsSection from '../components/PopularToolsSection.vue'
import FavoriteToolsSection from '../components/FavoriteToolsSection.vue'
import OtherToolsSection from '../components/OtherToolsSection.vue'
import type { Tool } from '../stores/toolStore'
import { useToolStore } from '../stores/toolStore'

// 获取toolStore
const toolStore = useToolStore()

// 接收从App.vue传递过来的props
const props = defineProps<{
  handleToolClick: (tool: Tool) => void
  handleToggleFavorite: (id: string) => void
}>()

// 从props中解构方法
const { handleToolClick, handleToggleFavorite } = props
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}
</style>
