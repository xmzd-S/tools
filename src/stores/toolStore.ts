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
  isFavorite: boolean;
  usageCount: number;
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
    name: '代码编辑器',
    description: '在线代码编辑器，支持多种编程语言',
    category: ToolCategory.DEVELOPMENT,
    icon: 'code',
    isFavorite: true,
    usageCount: 15
  },
  {
    id: '2',
    name: '颜色选择器',
    description: '快速选择和调整颜色值',
    category: ToolCategory.DESIGN,
    icon: 'bg-colors',
    isFavorite: true,
    usageCount: 12
  },
  {
    id: '3',
    name: 'JSON格式化',
    description: '格式化和验证JSON数据',
    category: ToolCategory.DEVELOPMENT,
    icon: 'file-text',
    isFavorite: false,
    usageCount: 8
  },
  {
    id: '4',
    name: '图片压缩',
    description: '在线图片压缩工具',
    category: ToolCategory.UTILITY,
    icon: 'picture',
    isFavorite: false,
    usageCount: 5
  },
  {
    id: '5',
    name: '文本比较',
    description: '比较两个文本的差异',
    category: ToolCategory.PRODUCTIVITY,
    icon: 'diff',
    isFavorite: true,
    usageCount: 10
  },
  {
    id: '6',
    name: '时间戳转换',
    description: '时间戳与日期格式相互转换',
    category: ToolCategory.UTILITY,
    icon: 'clock-circle',
    isFavorite: false,
    usageCount: 7
  },
  {
    id: '7',
    name: '密码生成器',
    description: '生成安全的随机密码',
    category: ToolCategory.UTILITY,
    icon: 'key',
    isFavorite: false,
    usageCount: 6
  },
  {
    id: '8',
    name: '二维码生成',
    description: '生成和解析二维码',
    category: ToolCategory.UTILITY,
    icon: 'qrcode',
    isFavorite: true,
    usageCount: 14
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
  
  // 获取收藏的工具
  const favoriteTools = computed(() => 
    tools.value.filter(tool => tool.isFavorite)
  );
  
  // 获取非收藏的工具
  const regularTools = computed(() => 
    tools.value.filter(tool => !tool.isFavorite)
  );
  
  // 获取常用工具（使用次数多的工具）
  const popularTools = computed(() => 
    [...tools.value]
      .filter(tool => tool.usageCount >= 10)
      .sort((a, b) => b.usageCount - a.usageCount)
  );
  
  // 搜索过滤后的工具
  const filteredTools = computed(() => {
    if (!searchKeyword.value.trim()) {
      return [...favoriteTools.value, ...regularTools.value];
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
  const addTool = (tool: Omit<Tool, 'id' | 'usageCount'>) => {
    const newTool: Tool = {
      ...tool,
      id: Date.now().toString(),
      usageCount: 0
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
  
  // 切换收藏状态
  const toggleFavorite = (id: string) => {
    const tool = tools.value.find(tool => tool.id === id);
    if (tool) {
      tool.isFavorite = !tool.isFavorite;
    }
  };
  
  // 增加使用次数
  const incrementUsage = (id: string) => {
    const tool = tools.value.find(tool => tool.id === id);
    if (tool) {
      tool.usageCount += 1;
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
    favoriteTools,
    regularTools,
    popularTools,
    filteredTools,
    categories,
    toolsByCategory,
    selectedTool,
    searchKeyword,
    
    addTool,
    updateTool,
    deleteTool,
    toggleFavorite,
    incrementUsage,
    setSearchKeyword,
    resetSearch,
    setSelectedTool
  };
});