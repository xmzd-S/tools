<template>
  <div class="blog-post-detail" v-if="post">
    <div class="post-header">
      <div class="header-cover" v-if="post.coverImage">
        <img :src="post.coverImage" :alt="post.title" />
        <div class="header-overlay"></div>
      </div>
      <div class="header-content">
        <a-button type="text" @click="goBack" class="back-button">
          <ArrowLeftOutlined />
          返回列表
        </a-button>
        <div class="post-category-badge">{{ post.categoryName }}</div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <div class="meta-item">
            <UserOutlined />
            <span>{{ post.author }}</span>
          </div>
          <div class="meta-item">
            <CalendarOutlined />
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <EyeOutlined />
            <span>{{ post.views }} 次阅读</span>
          </div>
          <div class="meta-item">
            <LikeOutlined />
            <span>{{ post.likes }} 次点赞</span>
          </div>
        </div>
        <div class="post-tags">
          <a-tag v-for="tag in post.tags" :key="tag">{{ tag }}</a-tag>
        </div>
      </div>
    </div>

    <div class="post-body">
      <div class="content-wrapper">
        <div class="post-content" v-html="renderContent(post.content)"></div>
        
        <div class="post-actions">
          <a-button type="primary" size="large" @click="handleLike">
            <LikeOutlined />
            点赞 ({{ post.likes }})
          </a-button>
          <a-button size="large">
            <ShareAltOutlined />
            分享
          </a-button>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-section">
          <h3>相关文章</h3>
          <div class="related-posts">
            <div 
              v-for="relatedPost in relatedPosts" 
              :key="relatedPost.id"
              class="related-post-item"
              @click="navigateToPost(relatedPost.id)"
            >
              <div class="related-post-title">{{ relatedPost.title }}</div>
              <div class="related-post-meta">
                <EyeOutlined />
                {{ relatedPost.views }}
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>热门标签</h3>
          <div class="popular-tags">
            <a-tag 
              v-for="tag in popularTags" 
              :key="tag"
              @click="filterByTag(tag)"
            >
              {{ tag }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-empty v-else description="文章不存在" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBlogStore } from '../stores/blogStore';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, EyeOutlined, LikeOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import type { BlogPost } from '../stores/blogStore';

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();

const post = ref<BlogPost>();

const relatedPosts = computed(() => {
  if (!post.value) return [];
  return blogStore.publishedPosts
    .filter(p => p.categoryId === post.value!.categoryId && p.id !== post.value!.id)
    .slice(0, 5);
});

const popularTags = computed(() => {
  return blogStore.allTags.slice(0, 10);
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const renderContent = (content: string) => {
  return content.split('\n').map(paragraph => {
    if (paragraph.trim()) {
      return `<p>${paragraph}</p>`;
    }
    return '';
  }).join('');
};

const goBack = () => {
  router.push('/blog');
};

const navigateToPost = (id: string) => {
  router.push(`/blog/${id}`);
};

const handleLike = () => {
  if (post.value) {
    blogStore.toggleLike(post.value.id);
  }
};

const filterByTag = (tag: string) => {
  blogStore.setSelectedTag(tag);
  router.push('/blog');
};

onMounted(() => {
  const postId = route.params.id as string;
  post.value = blogStore.getPostById(postId);
  
  if (post.value) {
    blogStore.incrementViews(post.value.id);
  }
});
</script>

<style scoped>
.blog-post-detail {
  min-height: 100vh;
  background: #f8fafc;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.post-header {
  position: relative;
  background: white;
  margin-bottom: 32px;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-cover {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.header-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-cover:hover img {
  transform: scale(1.05);
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  position: relative;
  margin-top: -80px;
}

.back-button {
  margin-bottom: 20px;
  font-size: 16px;
  color: #667eea;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #764ba2;
  transform: translateX(-4px);
}

.back-button:active {
  transform: translateX(-2px);
}

.post-category-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.post-category-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.post-title {
  font-size: 42px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.3;
  margin-bottom: 24px;
  transition: color 0.3s ease;
}

.post-title:hover {
  color: #667eea;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #64748b;
  transition: color 0.3s ease;
}

.meta-item:hover {
  color: #667eea;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.ant-tag) {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  color: #667eea;
  border-radius: 16px;
  font-size: 13px;
  padding: 6px 16px;
  margin: 0;
  transition: all 0.3s ease;
}

:deep(.ant-tag:hover) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.post-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
}

.content-wrapper {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-content {
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
}

.post-content :deep(p) {
  margin-bottom: 16px;
}

.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
}

.post-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
}

.post-actions :deep(.ant-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.post-actions :deep(.ant-btn:active) {
  transform: translateY(0);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInRight 0.6s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-section h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.related-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.related-post-item {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-post-item:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(4px);
}

.related-post-item:active {
  transform: translateX(2px);
}

.related-post-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.related-post-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.popular-tags :deep(.ant-tag) {
  cursor: pointer;
}

@media (max-width: 1024px) {
  .post-body {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-cover {
    height: 280px;
  }

  .post-title {
    font-size: 28px;
  }
  
  .header-content {
    padding: 24px 16px;
    margin-top: -60px;
  }
  
  .content-wrapper {
    padding: 24px;
  }

  .post-meta {
    gap: 16px;
  }

  .meta-item {
    font-size: 14px;
  }

  .post-actions {
    flex-direction: column;
  }

  .post-actions :deep(.ant-btn) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-cover {
    height: 220px;
  }

  .post-title {
    font-size: 24px;
  }

  .header-content {
    padding: 20px 12px;
  }

  .post-category-badge {
    font-size: 12px;
    padding: 6px 16px;
  }

  .content-wrapper {
    padding: 20px;
  }

  .post-content {
    font-size: 15px;
    line-height: 1.7;
  }

  :deep(.ant-tag) {
    font-size: 12px;
    padding: 5px 12px;
  }
}
</style>
