<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="page-title">控制台</h1>
      <div class="header-actions">
        <a-button type="primary" size="large" @click="refreshData">
          <ReloadOutlined />
          刷新数据
        </a-button>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.key">
          <div class="stat-icon" :style="{ background: stat.color }">
            <component :is="stat.icon" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-trend" :class="stat.trendClass">
              <component :is="stat.trendIcon" />
              {{ stat.trend }}
            </div>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <div class="card-header">
            <h3>文章发布趋势</h3>
            <a-radio-group v-model:value="timeRange" size="small">
              <a-radio-button value="week">本周</a-radio-button>
              <a-radio-button value="month">本月</a-radio-button>
              <a-radio-button value="year">全年</a-radio-button>
            </a-radio-group>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <LineChartOutlined class="chart-icon" />
              <p>文章发布趋势图表</p>
              <div class="chart-bars">
                <div class="chart-bar" v-for="(value, index) in chartData" :key="index" :style="{ height: `${value}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h3>分类分布</h3>
          </div>
          <div class="chart-container">
            <div class="category-distribution">
              <div 
                v-for="category in categoryStats" 
                :key="category.id"
                class="category-stat-item"
              >
                <div class="category-info">
                  <div class="category-dot" :style="{ background: category.color }"></div>
                  <span class="category-name">{{ category.name }}</span>
                </div>
                <div class="category-progress">
                  <div class="progress-bar" :style="{ width: `${category.percentage}%`, background: category.color }"></div>
                </div>
                <div class="category-count">{{ category.count }} 篇</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tables-section">
        <div class="table-card">
          <div class="card-header">
            <h3>最新文章</h3>
            <a-button type="link" @click="$router.push('/blog')">
              查看全部 <ArrowRightOutlined />
            </a-button>
          </div>
          <a-table 
            :columns="postColumns" 
            :data-source="recentPosts" 
            :pagination="false"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'title'">
                <div class="post-title-cell">
                  <img v-if="record.coverImage" :src="record.coverImage" :alt="record.title" />
                  <span>{{ record.title }}</span>
                </div>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'published' ? 'success' : 'default'">
                  {{ record.status === 'published' ? '已发布' : '草稿' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'views'">
                <span><EyeOutlined /> {{ record.views }}</span>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" size="small" @click="viewPost(record)">
                  查看
                </a-button>
              </template>
            </template>
          </a-table>
        </div>

        <div class="table-card">
          <div class="card-header">
            <h3>系统状态</h3>
          </div>
          <div class="system-status">
            <div class="status-item">
              <div class="status-label">系统运行时间</div>
              <div class="status-value">{{ systemStatus.uptime }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">内存使用</div>
              <div class="status-value">{{ systemStatus.memory }}</div>
              <a-progress :percent="systemStatus.memoryPercent" :stroke-color="getProgressColor(systemStatus.memoryPercent)" />
            </div>
            <div class="status-item">
              <div class="status-label">存储空间</div>
              <div class="status-value">{{ systemStatus.storage }}</div>
              <a-progress :percent="systemStatus.storagePercent" :stroke-color="getProgressColor(systemStatus.storagePercent)" />
            </div>
            <div class="status-item">
              <div class="status-label">数据库状态</div>
              <div class="status-value success">
                <CheckCircleOutlined />
                正常
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">API 服务</div>
              <div class="status-value success">
                <CheckCircleOutlined />
                正常
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3>快捷操作</h3>
        <div class="action-grid">
          <div class="action-card" @click="$router.push('/blog')">
            <FileAddOutlined class="action-icon" />
            <span>新建文章</span>
          </div>
          <div class="action-card" @click="$router.push('/categories')">
            <FolderAddOutlined class="action-icon" />
            <span>新建分类</span>
          </div>
          <div class="action-card" @click="$router.push('/blog')">
            <EyeOutlined class="action-icon" />
            <span>查看文章</span>
          </div>
          <div class="action-card" @click="$router.push('/categories')">
            <AppstoreOutlined class="action-icon" />
            <span>管理分类</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBlogStore } from '../stores/blogStore';
import { useCategoryStore } from '../stores/categoryStore';
import { ReloadOutlined, ArrowRightOutlined, EyeOutlined, FileAddOutlined, FolderAddOutlined, AppstoreOutlined, FileTextOutlined, UserOutlined, ReadOutlined, RiseOutlined, FallOutlined, LineChartOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import type { BlogPost } from '../stores/blogStore';
import { message } from 'ant-design-vue';

const router = useRouter();
const blogStore = useBlogStore();
const categoryStore = useCategoryStore();

const timeRange = ref('week');

const stats = computed(() => [
  {
    key: 'posts',
    label: '文章总数',
    value: blogStore.posts.length,
    icon: FileTextOutlined,
    color: '#667eea',
    trend: '+12%',
    trendIcon: RiseOutlined,
    trendClass: 'trend-up'
  },
  {
    key: 'views',
    label: '总浏览量',
    value: blogStore.posts.reduce((sum, post) => sum + post.views, 0).toLocaleString(),
    icon: EyeOutlined,
    color: '#f093fb',
    trend: '+28%',
    trendIcon: RiseOutlined,
    trendClass: 'trend-up'
  },
  {
    key: 'likes',
    label: '总点赞数',
    value: blogStore.posts.reduce((sum, post) => sum + post.likes, 0).toLocaleString(),
    icon: ReadOutlined,
    color: '#4facfe',
    trend: '+15%',
    trendIcon: RiseOutlined,
    trendClass: 'trend-up'
  },
  {
    key: 'categories',
    label: '分类数量',
    value: categoryStore.categories.length,
    icon: UserOutlined,
    color: '#43e97b',
    trend: '+2',
    trendIcon: RiseOutlined,
    trendClass: 'trend-up'
  }
]);

const chartData = ref([65, 78, 52, 91, 45, 83, 72]);

const categoryStats = computed(() => {
  const totalPosts = blogStore.posts.length;
  return categoryStore.categories.map(category => ({
    ...category,
    count: blogStore.getPostsByCategory(category.id).length,
    percentage: totalPosts > 0 ? (blogStore.getPostsByCategory(category.id).length / totalPosts) * 100 : 0
  })).filter(cat => cat.count > 0);
});

const recentPosts = computed(() => blogStore.recentPosts);

const postColumns = [
  {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title',
    width: '40%'
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    key: 'category',
    width: '20%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '15%'
  },
  {
    title: '浏览量',
    dataIndex: 'views',
    key: 'views',
    width: '15%'
  },
  {
    title: '操作',
    key: 'action',
    width: '10%'
  }
];

const systemStatus = ref({
  uptime: '15天 8小时 32分钟',
  memory: '2.4 GB / 8 GB',
  memoryPercent: 30,
  storage: '45.2 GB / 100 GB',
  storagePercent: 45
});

const refreshData = () => {
  message.success('数据已刷新');
};

const viewPost = (post: BlogPost) => {
  router.push(`/blog/${post.id}`);
};

const getProgressColor = (percent: number) => {
  if (percent < 50) return '#52c41a';
  if (percent < 80) return '#faad14';
  return '#f5222d';
};

onMounted(() => {
  console.log('Dashboard mounted');
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 50%, #eef2f6 100%);
  padding: 32px 0;
  animation: fadeIn 0.5s ease-out;
}

.dashboard-header {
  max-width: 1400px;
  margin: 0 auto 32px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, box-shadow;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
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

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:active {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
}

.stat-trend.trend-up {
  color: #52c41a;
}

.stat-trend.trend-down {
  color: #f5222d;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
}

.chart-card,
.table-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
}

.chart-card::before,
.table-card::before {
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

.chart-card:hover,
.table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.chart-card:hover::before,
.table-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.chart-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #94a3b8;
}

.chart-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.chart-placeholder p {
  font-size: 16px;
  margin-bottom: 24px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  height: 200px;
}

.chart-bar {
  width: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  animation: growUp 0.6s ease-out forwards;
  transform-origin: bottom;
}

@keyframes growUp {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.chart-bar:hover {
  transform: scaleY(1.05);
  filter: brightness(1.1);
}

.category-distribution {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.category-progress {
  flex: 1;
  height: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.category-count {
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.tables-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
}

.post-title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-title-cell img {
  width: 48px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.system-status {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-label {
  font-size: 14px;
  color: #64748b;
}

.status-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.status-value.success {
  color: #52c41a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-actions {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.quick-actions h3 {
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  border-radius: 16px;
  background: rgba(102, 126, 234, 0.05);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
}

.action-card::before {
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

.action-card:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.2);
}

.action-card:hover::before {
  opacity: 1;
}

.action-card:active {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
}

.action-icon {
  font-size: 32px;
  color: #667eea;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
}

.action-card:hover .action-icon {
  transform: scale(1.2) rotate(5deg);
}

.action-card span {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.action-card:hover span {
  color: #667eea;
}

@media (max-width: 1200px) {
  .charts-section,
  .tables-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 28px;
  }
}
</style>
