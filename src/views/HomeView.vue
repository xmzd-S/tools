<template>
  <div class="home">
    <ToolsSection
      :filtered-tools="toolStore.filteredTools"
      @tool-click="handleToolClick"
    />
  </div>
</template>

<script setup lang="ts">
import ToolsSection from '../components/ToolsSection.vue'
import type { Tool } from '../stores/toolStore'
import { useToolStore } from '../stores/toolStore'

// 获取toolStore
const toolStore = useToolStore()

// 接收从App.vue传递过来的props
const props = defineProps<{
  handleToolClick: (tool: Tool) => void
}>()

// 从props中解构方法
const { handleToolClick } = props
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
