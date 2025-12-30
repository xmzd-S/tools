<template>
  <div class="category-list">
    <div class="category-header">
      <h1 class="page-title">文章分类</h1>
      <a-button type="primary" size="large" @click="showCreateModal = true">
        <PlusOutlined />
        新建分类
      </a-button>
    </div>

    <div class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-card"
        :style="{ '--category-color': category.color }"
        @click="handleCategoryClick(category)"
      >
        <div class="card-header">
          <div class="category-icon" :style="{ background: category.color }">
            <component :is="getIconComponent(category.icon)" />
          </div>
          <div class="category-actions">
            <a-dropdown>
              <a-button type="text" size="small">
                <MoreOutlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click.stop="handleEdit(category)">
                    <EditOutlined />
                    编辑
                  </a-menu-item>
                  <a-menu-item @click.stop="handleDelete(category)">
                    <DeleteOutlined />
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <h3 class="category-name">{{ category.name }}</h3>
        <p class="category-description">{{ category.description }}</p>
        <div class="category-stats">
          <div class="stat-item">
            <FileTextOutlined />
            <span>{{ category.postCount }} 篇文章</span>
          </div>
          <div class="stat-item">
            <CalendarOutlined />
            <span>{{ formatDate(category.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="showCreateModal"
      :title="editingCategory ? '编辑分类' : '新建分类'"
      :footer="null"
      width="500px"
    >
      <a-form
        :model="formData"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item label="分类名称" name="name" :rules="[{ required: true, message: '请输入分类名称' }]">
          <a-input v-model:value="formData.name" placeholder="请输入分类名称" size="large" />
        </a-form-item>

        <a-form-item label="分类描述" name="description">
          <a-textarea 
            v-model:value="formData.description" 
            placeholder="请输入分类描述" 
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="图标" name="icon">
          <a-select v-model:value="formData.icon" placeholder="选择图标" size="large">
            <a-select-option value="code">
              <CodeOutlined /> 代码
            </a-select-option>
            <a-select-option value="server">
              <ServerOutlined /> 服务器
            </a-select-option>
            <a-select-option value="cloud">
              <CloudOutlined /> 云服务
            </a-select-option>
            <a-select-option value="database">
              <DatabaseOutlined /> 数据库
            </a-select-option>
            <a-select-option value="apartment">
              <ApartmentOutlined /> 架构
            </a-select-option>
            <a-select-option value="robot">
              <RobotOutlined /> AI
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="颜色" name="color">
          <div class="color-picker">
            <div 
              v-for="color in presetColors" 
              :key="color"
              class="color-option"
              :class="{ active: formData.color === color }"
              :style="{ background: color }"
              @click="formData.color = color"
            />
          </div>
        </a-form-item>

        <a-form-item>
          <a-space style="width: 100%; justify-content: flex-end;">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" html-type="submit">
              {{ editingCategory ? '更新' : '创建' }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '../stores/categoryStore';
import { useBlogStore } from '../stores/blogStore';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CalendarOutlined, CodeOutlined, SaveOutlined, CloudOutlined, DatabaseOutlined, ApartmentOutlined, RobotOutlined } from '@ant-design/icons-vue';
import type { Category } from '../stores/categoryStore';
import { message } from 'ant-design-vue';

const router = useRouter();
const categoryStore = useCategoryStore();
const blogStore = useBlogStore();

const showCreateModal = ref(false);
const editingCategory = ref<Category | null>(null);

const formData = reactive({
  name: '',
  description: '',
  icon: 'code',
  color: '#667eea'
});

const presetColors = [
  '#667eea',
  '#f093fb',
  '#4facfe',
  '#43e97b',
  '#fa709a',
  '#a8edea',
  '#ff9a9e',
  '#a18cd1',
  '#fbc2eb',
  '#8fd3f4'
];

const categories = computed(() => categoryStore.categories);

const handleCategoryClick = (category: Category) => {
  blogStore.setSelectedCategory(category.id);
  router.push('/blog');
};

const handleEdit = (category: Category) => {
  editingCategory.value = category;
  formData.name = category.name;
  formData.description = category.description;
  formData.icon = category.icon;
  formData.color = category.color;
  showCreateModal.value = true;
};

const handleDelete = (category: Category) => {
  if (category.postCount > 0) {
    message.warning('该分类下还有文章，无法删除');
    return;
  }
  
  categoryStore.deleteCategory(category.id);
  message.success('分类删除成功');
};

const handleSubmit = () => {
  if (editingCategory.value) {
    categoryStore.updateCategory(editingCategory.value.id, {
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color
    });
    message.success('分类更新成功');
  } else {
    categoryStore.addCategory({
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color
    });
    message.success('分类创建成功');
  }
  
  handleCancel();
};

const handleCancel = () => {
  showCreateModal.value = false;
  editingCategory.value = null;
  formData.name = '';
  formData.description = '';
  formData.icon = 'code';
  formData.color = '#667eea';
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
    code: CodeOutlined,
    server: SaveOutlined,
    cloud: CloudOutlined,
    database: DatabaseOutlined,
    apartment: ApartmentOutlined,
    robot: RobotOutlined,
  };
  
  return iconMap[iconName] || CodeOutlined;
};
</script>

<style scoped>
.category-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 50%, #eef2f6 100%);
  padding: 32px 0;
  animation: fadeIn 0.5s ease-out;
}

.category-header {
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

.categories-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
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

.category-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, box-shadow;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--category-color);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
  pointer-events: none;
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.category-card:hover::before {
  opacity: 0.05;
}

.category-card:active {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

.category-name {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.category-card:hover .category-name {
  color: var(--category-color);
}

.category-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 24px;
  position: relative;
  z-index: 1;
}

.category-stats {
  display: flex;
  gap: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #1e293b;
  transform: scale(1.15);
}

@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 28px;
  }
}
</style>
