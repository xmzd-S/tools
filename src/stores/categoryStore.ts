import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  createdAt: string;
}

export const initialCategories: Category[] = [
  {
    id: '1',
    name: '前端开发',
    description: 'HTML、CSS、JavaScript、Vue、React 等前端技术',
    icon: 'code',
    color: '#667eea',
    postCount: 3,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: '2',
    name: '后端开发',
    description: 'Node.js、Python、Java、Go 等后端技术',
    icon: 'server',
    color: '#f093fb',
    postCount: 2,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: '3',
    name: 'DevOps',
    description: 'Docker、Kubernetes、CI/CD 等运维技术',
    icon: 'cloud',
    color: '#4facfe',
    postCount: 1,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: '4',
    name: '数据库',
    description: 'MySQL、MongoDB、Redis 等数据库技术',
    icon: 'database',
    color: '#43e97b',
    postCount: 0,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: '5',
    name: '算法与数据结构',
    description: '算法设计、数据结构、编程竞赛等',
    icon: 'apartment',
    color: '#fa709a',
    postCount: 0,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: '6',
    name: '人工智能',
    description: '机器学习、深度学习、NLP 等AI技术',
    icon: 'robot',
    color: '#a8edea',
    postCount: 0,
    createdAt: '2024-01-01T00:00:00'
  }
];

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>(JSON.parse(JSON.stringify(initialCategories)));

  const allCategories = computed(() => categories.value);

  const getCategoryById = (id: string) => {
    return categories.value.find(category => category.id === id);
  };

  const addCategory = (category: Omit<Category, 'id' | 'postCount' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      postCount: 0,
      createdAt: new Date().toISOString()
    };
    categories.value.push(newCategory);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(category => category.id === id);
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates };
    }
  };

  const deleteCategory = (id: string) => {
    const index = categories.value.findIndex(category => category.id === id);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  };

  const incrementPostCount = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (category) {
      category.postCount += 1;
    }
  };

  const decrementPostCount = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (category && category.postCount > 0) {
      category.postCount -= 1;
    }
  };

  return {
    categories: allCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    incrementPostCount,
    decrementPostCount
  };
});
