<template>
  <div class="blog-post-card" @click="handleClick">
    <div class="post-cover" v-if="post.coverImage">
      <img :src="post.coverImage" :alt="post.title" />
      <div class="post-overlay">
        <div class="post-category">{{ post.categoryName }}</div>
      </div>
    </div>
    <div class="post-content">
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-meta">
        <div class="meta-left">
          <span class="meta-item">
            <UserOutlined />
            {{ post.author }}
          </span>
          <span class="meta-item">
            <CalendarOutlined />
            {{ formatDate(post.createdAt) }}
          </span>
        </div>
        <div class="meta-right">
          <span class="meta-item">
            <EyeOutlined />
            {{ post.views }}
          </span>
          <span class="meta-item">
            <LikeOutlined />
            {{ post.likes }}
          </span>
        </div>
      </div>
      <div class="post-tags">
        <a-tag v-for="tag in post.tags" :key="tag">{{ tag }}</a-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, CalendarOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons-vue';
import type { BlogPost } from '../stores/blogStore';

interface Props {
  post: BlogPost;
}

interface Emits {
  (e: 'click', post: BlogPost): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click', props.post);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.blog-post-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, box-shadow;
  position: relative;
}

.blog-post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
  pointer-events: none;
}

.blog-post-card:hover::before {
  opacity: 1;
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

.blog-post-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.blog-post-card:active {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.post-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-post-card:hover .post-cover img {
  transform: scale(1.1);
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.post-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.post-content {
  padding: 24px;
  position: relative;
  z-index: 1;
}

.post-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.blog-post-card:hover .post-title {
  color: #667eea;
}

.post-excerpt {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.meta-left,
.meta-right {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #94a3b8;
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
  border-radius: 12px;
  font-size: 12px;
  padding: 4px 12px;
  margin: 0;
  transition: all 0.3s ease;
}

:deep(.ant-tag:hover) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .post-cover {
    height: 160px;
  }

  .post-content {
    padding: 20px;
  }

  .post-title {
    font-size: 18px;
  }

  .post-excerpt {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }

  .meta-left,
  .meta-right {
    gap: 12px;
  }

  .meta-item {
    font-size: 12px;
  }

  :deep(.ant-tag) {
    font-size: 11px;
    padding: 3px 10px;
  }
}

@media (max-width: 480px) {
  .post-cover {
    height: 140px;
  }

  .post-content {
    padding: 16px;
  }

  .post-title {
    font-size: 16px;
  }

  .post-excerpt {
    font-size: 12px;
  }

  .post-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .meta-left,
  .meta-right {
    width: 100%;
  }
}
</style>
