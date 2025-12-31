import api from './api';
import { Category } from '../stores/categoryStore';

// 分类创建请求类型
export interface CategoryCreate {
  name: string;
  description: string;
  icon: string;
  color: string;
}

// 分类更新请求类型
export interface CategoryUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

// 分类API服务
export const categoryApi = {
  // 获取分类列表
  getCategoryList: (): Promise<{ list: Category[] }> => {
    return api.get('/categories');
  },

  // 获取分类详情
  getCategoryDetail: (id: string): Promise<{ category: Category }> => {
    return api.get(`/categories/${id}`);
  },

  // 创建分类
  createCategory: (data: CategoryCreate): Promise<{ category: Category }> => {
    return api.post('/categories', data);
  },

  // 更新分类
  updateCategory: (id: string, data: CategoryUpdate): Promise<{ category: Category }> => {
    return api.put(`/categories/${id}`, data);
  },

  // 删除分类
  deleteCategory: (id: string): Promise<void> => {
    return api.delete(`/categories/${id}`);
  },
};

export default categoryApi;