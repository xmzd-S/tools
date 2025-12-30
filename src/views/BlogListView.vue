<template>
  <div class="blog-list">
    <div class="blog-header">
      <h1 class="page-title">博客文章</h1>
      <div class="search-bar">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索文章..."
          size="large"
          allow-clear
          @search="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>
      </div>
    </div>

    <div class="blog-content">
      <div class="main-content">
        <div class="filter-bar">
          <a-space>
            <a-select
              v-model:value="selectedCategory"
              placeholder="选择分类"
              style="width: 180px"
              allow-clear
              @change="handleCategoryChange"
            >
              <a-select-option value="">全部分类</a-select-option>
              <a-select-option 
                v-for="category in categories" 
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }} ({{ category.postCount }})
              </a-select-option>
            </a-select>
            <a-select
              v-model:value="selectedTag"
              placeholder="选择标签"
              style="width: 180px"
              allow-clear
              @change="handleTagChange"
            >
              <a-select-option value="">全部标签</a-select-option>
              <a-select-option 
                v-for="tag in allTags" 
                :key="tag"
                :value="tag"
              >
                {{ tag }}
              </a-select-option>
            </a-select>
            <a-button @click="resetFilters" v-if="hasActiveFilters">
              <ClearOutlined />
              清除筛选
            </a-button>
          </a-space>
        </div>

        <div class="posts-grid" v-if="filteredPosts.length > 0">
          <BlogPostCard
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            :post="post"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="handlePostClick"
          />
        </div>

        <a-empty v-else description="暂无文章" />
      </div>

      <div class="sidebar">
        <div class="sidebar-widget">
          <h3>最新文章</h3>
          <div class="recent-posts">
            <div 
              v-for="post in recentPosts" 
              :key="post.id"
              class="recent-post-item"
              @click="handlePostClick(post)"
            >
              <div class="recent-post-image" v-if="post.coverImage">
                <img :src="post.coverImage" :alt="post.title" />
              </div>
              <div class="recent-post-content">
                <div class="recent-post-title">{{ post.title }}</div>
                <div class="recent-post-meta">
                  <CalendarOutlined />
                  {{ formatDate(post.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-widget">
          <h3>热门文章</h3>
          <div class="popular-posts">
            <div 
              v-for="(post, index) in popularPosts" 
              :key="post.id"
              class="popular-post-item"
              @click="handlePostClick(post)"
            >
              <div class="post-rank">{{ index + 1 }}</div>
              <div class="popular-post-content">
                <div class="popular-post-title">{{ post.title }}</div>
                <div class="popular-post-meta">
                  <EyeOutlined />
                  {{ post.views }}
                  <LikeOutlined />
                  {{ post.likes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-widget">
          <h3>文章分类</h3>
          <div class="category-list">
            <div 
              v-for="category in categories" 
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="handleCategoryClick(category.id)"
            >
              <div class="category-icon" :style="{ background: category.color }">
                <component :is="getIconComponent(category.icon)" />
              </div>
              <div class="category-info">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-count">{{ category.postCount }} 篇文章</div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-widget">
          <h3>热门标签</h3>
          <div class="tag-cloud">
            <a-tag 
              v-for="tag in allTags" 
              :key="tag"
              :class="{ active: selectedTag === tag }"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBlogStore } from '../stores/blogStore';
import { useCategoryStore } from '../stores/categoryStore';
import BlogPostCard from '../components/BlogPostCard.vue';
import { SearchOutlined, ClearOutlined, CalendarOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons-vue';
import * as Icons from '@ant-design/icons-vue';
import type { BlogPost } from '../stores/blogStore';

const router = useRouter();
const blogStore = useBlogStore();
const categoryStore = useCategoryStore();

const searchKeyword = ref('');
const selectedCategory = ref('');
const selectedTag = ref('');

const filteredPosts = computed(() => blogStore.filteredPosts);
const recentPosts = computed(() => blogStore.recentPosts);
const popularPosts = computed(() => blogStore.popularPosts);
const allTags = computed(() => blogStore.allTags);
const categories = computed(() => categoryStore.categories);

const hasActiveFilters = computed(() => 
  searchKeyword.value || selectedCategory.value || selectedTag.value
);

const handleSearch = () => {
  blogStore.setSearchKeyword(searchKeyword.value);
};

const handleCategoryChange = (value: string) => {
  selectedCategory.value = value;
  blogStore.setSelectedCategory(value);
};

const handleTagChange = (value: string) => {
  selectedTag.value = value;
  blogStore.setSelectedTag(value);
};

const handleCategoryClick = (categoryId: string) => {
  selectedCategory.value = categoryId;
  blogStore.setSelectedCategory(categoryId);
};

const handleTagClick = (tag: string) => {
  selectedTag.value = tag;
  blogStore.setSelectedTag(tag);
};

const resetFilters = () => {
  searchKeyword.value = '';
  selectedCategory.value = '';
  selectedTag.value = '';
  blogStore.resetFilters();
};

const handlePostClick = (post: BlogPost) => {
  router.push(`/blog/${post.id}`);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    code: Icons.CodeOutlined,
    server: Icons.SaveOutlined,
    cloud: Icons.CloudOutlined,
    database: Icons.DatabaseOutlined,
    apartment: Icons.ApartmentOutlined,
    robot: Icons.RobotOutlined,
  };
  
  return iconMap[iconName] || Icons.AppstoreOutlined;
};
</script>

<style scoped>
.blog-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 50%, #eef2f6 100%);
  padding: 32px 0;
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

.blog-header {
  max-width: 1400px;
  margin: 0 auto 32px;
  padding: 0 24px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-bar {
  max-width: 600px;
}

:deep(.ant-input-search) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

:deep(.ant-input-search .ant-input) {
  border-radius: 12px 0 0 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  padding: 12px 16px;
}

:deep(.ant-input-search .ant-input:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.ant-input-search-button) {
  border-radius: 0 12px 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.blog-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
}

.main-content {
  min-width: 0;
}

.filter-bar {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-widget {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
}

.sidebar-widget::before {
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
  pointer-events: none;
}

.sidebar-widget:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.sidebar-widget:hover::before {
  opacity: 1;
}

.sidebar-widget h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.recent-posts,
.popular-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recent-post-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-post-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(4px);
}

.recent-post-image {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.recent-post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recent-post-content {
  flex: 1;
  min-width: 0;
}

.recent-post-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recent-post-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.popular-post-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-post-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(4px);
}

.post-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.popular-post-content {
  flex: 1;
  min-width: 0;
}

.popular-post-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(4px);
}

.category-item.active {
  background: rgba(102, 126, 234, 0.1);
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 2px;
}

.category-count {
  font-size: 12px;
  color: #94a3b8;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-cloud :deep(.ant-tag) {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  color: #667eea;
  border-radius: 16px;
  font-size: 13px;
  padding: 6px 14px;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-cloud :deep(.ant-tag:hover) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.tag-cloud :deep(.ant-tag.active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

@media (max-width: 1200px) {
  .blog-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
  .filter-bar :deep(.ant-space) {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
