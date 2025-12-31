import api from './api';
import { BlogPost } from '../stores/blogStore';

// 文章列表查询参数类型
export interface BlogListParams {
  page?: number;
  size?: number;
  categoryId?: string;
  tag?: string;
  keyword?: string;
  status?: 'draft' | 'published';
}

// 文章创建请求类型
export interface BlogPostCreate {
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
}

// 文章更新请求类型
export interface BlogPostUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  categoryId?: string;
  coverImage?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

// 文章列表响应类型
export interface BlogListResponse {
  total: number;
  list: BlogPost[];
}

// 博客文章API服务
export const blogApi = {
  // 获取文章列表
  getBlogList: (params?: BlogListParams): Promise<BlogListResponse> => {
    return api.get('/blogs', params);
  },

  // 获取文章详情
  getBlogDetail: (id: string): Promise<{ post: BlogPost }> => {
    return api.get(`/blogs/${id}`);
  },

  // 创建文章
  createBlog: (data: BlogPostCreate): Promise<{ post: BlogPost }> => {
    return api.post('/blogs', data);
  },

  // 更新文章
  updateBlog: (id: string, data: BlogPostUpdate): Promise<{ post: BlogPost }> => {
    return api.put(`/blogs/${id}`, data);
  },

  // 删除文章
  deleteBlog: (id: string): Promise<void> => {
    return api.delete(`/blogs/${id}`);
  },

  // 增加浏览量
  incrementViews: (id: string): Promise<{ views: number }> => {
    return api.post(`/blogs/${id}/views`);
  },

  // 点赞文章
  likeBlog: (id: string): Promise<{ likes: number }> => {
    return api.post(`/blogs/${id}/like`);
  },

  // 获取热门文章
  getHotBlogs: (limit?: number): Promise<{ list: BlogPost[] }> => {
    return api.get('/blogs/hot', { limit });
  },

  // 获取最新文章
  getRecentBlogs: (limit?: number): Promise<{ list: BlogPost[] }> => {
    return api.get('/blogs/recent', { limit });
  },

  // 获取所有标签
  getAllTags: (): Promise<{ tags: string[] }> => {
    return api.get('/blogs/tags');
  },
};

export default blogApi;