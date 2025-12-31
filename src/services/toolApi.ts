import api from './api';
import { Tool } from '../stores/toolStore';

// 工具列表查询参数类型
export interface ToolListParams {
  keyword?: string;
  category?: string;
}

// 工具创建请求类型
export interface ToolCreate {
  name: string;
  description: string;
  category: string;
  icon: string;
  url?: string;
}

// 工具更新请求类型
export interface ToolUpdate {
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  url?: string;
}

// 工具API服务
export const toolApi = {
  // 获取工具列表
  getToolList: (params?: ToolListParams): Promise<{ list: Tool[] }> => {
    return api.get('/tools', params);
  },

  // 获取工具详情
  getToolDetail: (id: string): Promise<{ tool: Tool }> => {
    return api.get(`/tools/${id}`);
  },

  // 创建工具
  createTool: (data: ToolCreate): Promise<{ tool: Tool }> => {
    return api.post('/tools', data);
  },

  // 更新工具
  updateTool: (id: string, data: ToolUpdate): Promise<{ tool: Tool }> => {
    return api.put(`/tools/${id}`, data);
  },

  // 删除工具
  deleteTool: (id: string): Promise<void> => {
    return api.delete(`/tools/${id}`);
  },

  // 获取工具分类
  getToolCategories: (): Promise<{ categories: string[] }> => {
    return api.get('/tools/categories');
  },
};

export default toolApi;