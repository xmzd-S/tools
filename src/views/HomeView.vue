<template>
  <div class="home">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <span class="welcome-highlight">欢迎来到</span>
          <br>
          <span class="welcome-subtitle">博客系统</span>
        </h1>
        <p class="welcome-description">
          分享知识，记录成长，探索技术的无限可能
        </p>
        <div class="welcome-actions">
          <a-button type="primary" size="large" @click="$router.push('/blog')">
            浏览文章
          </a-button>
          <a-button size="large" @click="$router.push('/dashboard')">
            进入控制台
          </a-button>
        </div>
      </div>
    </div>

    <div class="quick-access-section">
      <h2 class="section-title">快速访问</h2>
      <div class="quick-access-grid">
        <div class="quick-access-card" @click="$router.push('/blog')">
          <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <ReadOutlined />
          </div>
          <h3>博客文章</h3>
          <p>浏览所有文章</p>
          <div class="card-badge">{{ blogStore.publishedPosts.length }} 篇</div>
        </div>

        <div class="quick-access-card" @click="$router.push('/categories')">
          <div class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <AppstoreOutlined />
          </div>
          <h3>文章分类</h3>
          <p>管理文章分类</p>
          <div class="card-badge">{{ categoryStore.categories.length }} 个</div>
        </div>

        <div class="quick-access-card" @click="$router.push('/dashboard')">
          <div class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <DashboardOutlined />
          </div>
          <h3>控制台</h3>
          <p>查看统计数据</p>
          <div class="card-badge">实时</div>
        </div>

        <div class="quick-access-card" @click="$router.push('/about')">
          <div class="card-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <InfoCircleOutlined />
          </div>
          <h3>关于我们</h3>
          <p>了解更多信息</p>
          <div class="card-badge">介绍</div>
        </div>
      </div>
    </div>

    <div class="recent-posts-section">
      <div class="section-header">
        <h2 class="section-title">最新文章</h2>
        <a-button type="link" @click="$router.push('/blog')">
          查看全部 <ArrowRightOutlined />
        </a-button>
      </div>
      <div class="recent-posts-grid">
        <BlogPostCard
          v-for="post in recentPosts"
          :key="post.id"
          :post="post"
          @click="handlePostClick"
        />
      </div>
    </div>

    <div class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">{{ blogStore.posts.length }}</div>
          <div class="stat-label">文章总数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ totalViews.toLocaleString() }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ categoryStore.categories.length }}</div>
          <div class="stat-label">分类数量</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ blogStore.allTags.length }}</div>
          <div class="stat-label">标签数量</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBlogStore } from '../stores/blogStore';
import { useCategoryStore } from '../stores/categoryStore';
import BlogPostCard from '../components/BlogPostCard.vue';
import { ReadOutlined, AppstoreOutlined, DashboardOutlined, InfoCircleOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import type { BlogPost } from '../stores/blogStore';

const router = useRouter();
const blogStore = useBlogStore();
const categoryStore = useCategoryStore();

const recentPosts = computed(() => blogStore.recentPosts.slice(0, 3));

const totalViews = computed(() => 
  blogStore.posts.reduce((sum, post) => sum + post.views, 0)
);

const handlePostClick = (post: BlogPost) => {
  router.push(`/blog/${post.id}`);
};
</script>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.welcome-section {
  padding: 80px 24px 60px;
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
  margin: 0 0 32px;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.welcome-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-access-section {
  padding: 40px 24px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.quick-access-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.quick-access-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.quick-access-card:hover::before {
  opacity: 1;
}

.quick-access-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 36px;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
}

.quick-access-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.quick-access-card h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  position: relative;
  z-index: 1;
}

.quick-access-card p {
  margin: 0 0 16px;
  font-size: 14px;
  color: #64748b;
  position: relative;
  z-index: 1;
}

.card-badge {
  display: inline-block;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.recent-posts-section {
  padding: 40px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.recent-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.stats-section {
  padding: 40px 24px 60px;
}

.stats-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-item {
  text-align: center;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

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

  .quick-access-grid,
  .recent-posts-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 24px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    padding: 24px;
  }

  .stat-number {
    font-size: 32px;
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

  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
