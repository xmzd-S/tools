import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import toolApi from '../services/toolApi';
import type { ToolCreate, ToolUpdate, ToolListParams } from '../services/toolApi';

// 工具类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url?: string;
}

// 工具分类枚举
export enum ToolCategory {
  DEVELOPMENT = '开发工具',
  DESIGN = '设计工具',
  PRODUCTIVITY = '效率工具',
  UTILITY = '实用工具',
  EDUCATION = '学习工具',
  OTHER = '其他'
}

// 工具ID常量
export const TOOL_ID_JSON_FORMATTER = '1';
export const TOOL_ID_AI_CHAT = '2';

export const useToolStore = defineStore('tool', () => {
  // 工具列表
  const tools = ref<Tool[]>([]);
  
  // 当前选中的工具
  const selectedTool = ref<Tool | null>(null);
  
  // 搜索关键词
  const searchKeyword = ref('');
  
  // 加载状态
  const isLoading = ref(false);
  
  // 错误信息
  const error = ref<string | null>(null);
  
  // 获取所有工具
  const allTools = computed(() => tools.value);
  
  // 搜索过滤后的工具
  const filteredTools = computed(() => {
    if (!searchKeyword.value.trim()) {
      return tools.value;
    }
    
    const keyword = searchKeyword.value.toLowerCase();
    return tools.value.filter(tool => 
      tool.name.toLowerCase().includes(keyword) || 
      tool.description.toLowerCase().includes(keyword) ||
      tool.category.toLowerCase().includes(keyword)
    );
  });
  
  // 获取所有分类
  const categories = computed(() => 
    Array.from(new Set(tools.value.map(tool => tool.category)))
  );
  
  // 按分类分组的工具
  const toolsByCategory = computed(() => {
    const grouped: Record<string, Tool[]> = {};
    tools.value.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  });
  
  // 异步方法：获取工具列表
  const fetchTools = async (params?: ToolListParams) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await toolApi.getToolList({
        keyword: params?.keyword || searchKeyword.value,
        category: params?.category
      });
      tools.value = response.list;
    } catch (err: any) {
      error.value = err.message || '获取工具列表失败';
      console.error('获取工具列表失败:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 异步方法：获取工具详情
  const fetchToolById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await toolApi.getToolDetail(id);
      return response.tool;
    } catch (err: any) {
      error.value = err.message || '获取工具详情失败';
      console.error('获取工具详情失败:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 异步方法：获取工具分类
  const fetchToolCategories = async () => {
    try {
      const response = await toolApi.getToolCategories();
      return response.categories;
    } catch (err: any) {
      console.error('获取工具分类失败:', err);
      return [];
    }
  };
  
  // 添加工具
  const addTool = async (tool: ToolCreate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await toolApi.createTool(tool);
      tools.value.push(response.tool);
      return response.tool;
    } catch (err: any) {
      error.value = err.message || '创建工具失败';
      console.error('创建工具失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 更新工具
  const updateTool = async (id: string, tool: ToolUpdate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await toolApi.updateTool(id, tool);
      const index = tools.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tools.value[index] = response.tool;
      }
      return response.tool;
    } catch (err: any) {
      error.value = err.message || '更新工具失败';
      console.error('更新工具失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 删除工具
  const deleteTool = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await toolApi.deleteTool(id);
      const index = tools.value.findIndex(tool => tool.id === id);
      if (index !== -1) {
        tools.value.splice(index, 1);
      }
    } catch (err: any) {
      error.value = err.message || '删除工具失败';
      console.error('删除工具失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 设置搜索关键词
  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword;
    fetchTools();
  };
  
  // 重置搜索
  const resetSearch = () => {
    searchKeyword.value = '';
    fetchTools();
  };
  
  // 设置选中的工具
  const setSelectedTool = (tool: Tool | null) => {
    selectedTool.value = tool;
  };

  return {
    // 状态
    tools: allTools,
    filteredTools,
    categories,
    toolsByCategory,
    selectedTool,
    searchKeyword,
    isLoading,
    error,
    
    // 方法
    fetchTools,
    fetchToolById,
    fetchToolCategories,
    addTool,
    updateTool,
    deleteTool,
    setSearchKeyword,
    resetSearch,
    setSelectedTool
  };
});