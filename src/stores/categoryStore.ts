import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import categoryApi from '../services/categoryApi';
import type { CategoryCreate, CategoryUpdate } from '../services/categoryApi';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  createdAt: string;
}

export const useCategoryStore = defineStore('category', () => {
  // 状态管理
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const allCategories = computed(() => categories.value);

  // 异步方法
  const fetchCategories = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.getCategoryList();
      categories.value = response.list;
    } catch (err: any) {
      error.value = err.message || '获取分类列表失败';
      console.error('获取分类列表失败:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategoryById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.getCategoryDetail(id);
      return response.category;
    } catch (err: any) {
      error.value = err.message || '获取分类详情失败';
      console.error('获取分类详情失败:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getCategoryById = (id: string) => {
    return categories.value.find(category => category.id === id);
  };

  const addCategory = async (category: CategoryCreate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.createCategory(category);
      categories.value.push(response.category);
      return response.category;
    } catch (err: any) {
      error.value = err.message || '创建分类失败';
      console.error('创建分类失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCategory = async (id: string, updates: CategoryUpdate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.updateCategory(id, updates);
      const index = categories.value.findIndex(category => category.id === id);
      if (index !== -1) {
        categories.value[index] = response.category;
      }
      return response.category;
    } catch (err: any) {
      error.value = err.message || '更新分类失败';
      console.error('更新分类失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await categoryApi.deleteCategory(id);
      const index = categories.value.findIndex(category => category.id === id);
      if (index !== -1) {
        categories.value.splice(index, 1);
      }
    } catch (err: any) {
      error.value = err.message || '删除分类失败';
      console.error('删除分类失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const incrementPostCount = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (category) {
      category.postCount += 1;
      // 这里可以添加API调用，同步更新后端数据
    }
  };

  const decrementPostCount = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (category && category.postCount > 0) {
      category.postCount -= 1;
      // 这里可以添加API调用，同步更新后端数据
    }
  };

  return {
    categories: allCategories,
    isLoading,
    error,
    fetchCategories,
    fetchCategoryById,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    incrementPostCount,
    decrementPostCount
  };
});
