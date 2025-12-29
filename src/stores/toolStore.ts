import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

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

// 模拟工具数据
export const initialTools: Tool[] = [
  {
    id: '1',
    name: 'JSON格式化',
    description: '格式化和验证JSON数据',
    category: ToolCategory.DEVELOPMENT,
    icon: 'file-text'
  }
];

export const useToolStore = defineStore('tool', () => {
  // 工具列表
  const tools = ref<Tool[]>(JSON.parse(JSON.stringify(initialTools)));
  
  // 当前选中的工具
  const selectedTool = ref<Tool | null>(null);
  
  // 搜索关键词
  const searchKeyword = ref('');
  
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
  
  // 添加工具
  const addTool = (tool: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...tool,
      id: Date.now().toString()
    };
    tools.value.push(newTool);
  };
  
  // 更新工具
  const updateTool = (updatedTool: Tool) => {
    const index = tools.value.findIndex(tool => tool.id === updatedTool.id);
    if (index !== -1) {
      tools.value[index] = { ...updatedTool };
    }
  };
  
  // 删除工具
  const deleteTool = (id: string) => {
    const index = tools.value.findIndex(tool => tool.id === id);
    if (index !== -1) {
      tools.value.splice(index, 1);
    }
  };
  
  // 设置搜索关键词
  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword;
  };
  
  // 重置搜索
  const resetSearch = () => {
    searchKeyword.value = '';
  };
  
  // 设置选中的工具
  const setSelectedTool = (tool: Tool | null) => {
    selectedTool.value = tool;
  };

  return {
    tools: allTools,
    filteredTools,
    categories,
    toolsByCategory,
    selectedTool,
    searchKeyword,
    
    addTool,
    updateTool,
    deleteTool,
    setSearchKeyword,
    resetSearch,
    setSelectedTool
  };
});