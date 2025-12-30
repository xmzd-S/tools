<template>
  <div class="home">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <span class="welcome-highlight">欢迎使用</span>
          <br>
          <span class="welcome-subtitle">工具应用</span>
        </h1>
        <p class="welcome-description">
          一站式工具集合，提升您的工作效率
        </p>
      </div>
    </div>
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.welcome-section {
  padding: 60px 24px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(30px, -30px) rotate(180deg);
  }
}

.welcome-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 1s ease-out;
}

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

.welcome-title {
  font-size: 56px;
  font-weight: 900;
  margin: 0 0 20px;
  line-height: 1.2;
  letter-spacing: -1px;
}

.welcome-highlight {
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 8px;
}

.welcome-subtitle {
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.welcome-description {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-section {
    padding: 40px 20px 30px;
  }

  .welcome-title {
    font-size: 42px;
  }

  .welcome-highlight {
    font-size: 32px;
  }

  .welcome-description {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .welcome-section {
    padding: 30px 16px 20px;
  }

  .welcome-title {
    font-size: 32px;
  }

  .welcome-highlight {
    font-size: 24px;
  }

  .welcome-description {
    font-size: 14px;
  }
}
</style>
