<template>
  <div class="about">
    <div class="about-content">
      <div class="about-header">
        <div class="about-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="about-title">关于我们</h1>
      </div>
      <div class="about-description">
        <p>这是一个基于 Tauri 和 Vue 3 开发的现代化工具应用。</p>
        <p>我们致力于提供各种实用工具，帮助您提高工作效率，简化日常任务。</p>
        <p>无论是开发、设计还是日常办公，我们都能为您提供便捷的解决方案。</p>
      </div>
      <div class="about-features">
        <div class="feature-item">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>快速高效</h3>
          <p>基于原生技术，提供极致性能</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>简单易用</h3>
          <p>直观的界面，无需学习成本</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22S2 12 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>安全可靠</h3>
          <p>本地运行，保护您的隐私</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.about-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out;
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

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  animation: float 3s ease-in-out infinite;
}

.about-icon svg {
  width: 48px;
  height: 48px;
  color: white;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.about-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.about-description {
  text-align: center;
  margin-bottom: 48px;
}

.about-description p {
  font-size: 18px;
  line-height: 1.8;
  color: #64748b;
  margin: 0 0 16px;
  font-weight: 400;
}

.about-description p:last-child {
  margin-bottom: 0;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.feature-item {
  text-align: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.feature-icon svg {
  width: 30px;
  height: 30px;
  color: white;
}

.feature-item h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.feature-item:hover h3 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-item p {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about {
    padding: 24px 16px;
  }

  .about-content {
    padding: 32px 24px;
  }

  .about-title {
    font-size: 28px;
  }

  .about-description p {
    font-size: 16px;
  }

  .about-features {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-item {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .about-content {
    padding: 24px 16px;
  }

  .about-title {
    font-size: 24px;
  }

  .about-icon {
    width: 64px;
    height: 64px;
  }

  .about-icon svg {
    width: 36px;
    height: 36px;
  }
}
</style>
