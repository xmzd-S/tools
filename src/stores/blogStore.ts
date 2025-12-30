import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  categoryName: string;
  author: string;
  coverImage?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  status: 'draft' | 'published';
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Vue 3 Composition API 深度解析',
    content: 'Vue 3 的 Composition API 是一个重大的更新，它提供了更好的代码组织方式和逻辑复用能力。本文将深入探讨 Composition API 的核心概念、使用场景以及最佳实践...',
    excerpt: '深入探讨 Vue 3 Composition API 的核心概念、使用场景以及最佳实践',
    categoryId: '1',
    categoryName: '前端开发',
    author: '张三',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    views: 1250,
    likes: 89,
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    tags: ['Vue3', 'Composition API', '前端'],
    status: 'published'
  },
  {
    id: '2',
    title: 'TypeScript 高级类型系统指南',
    content: 'TypeScript 的类型系统非常强大，本文将介绍泛型、条件类型、映射类型等高级特性，帮助你更好地掌握 TypeScript...',
    excerpt: '全面介绍 TypeScript 的泛型、条件类型、映射类型等高级特性',
    categoryId: '1',
    categoryName: '前端开发',
    author: '李四',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    views: 980,
    likes: 67,
    createdAt: '2024-01-20T14:20:00',
    updatedAt: '2024-01-20T14:20:00',
    tags: ['TypeScript', '类型系统', '前端'],
    status: 'published'
  },
  {
    id: '3',
    title: 'React Hooks 最佳实践',
    content: 'React Hooks 改变了我们编写 React 组件的方式。本文将分享 Hooks 的使用技巧和常见陷阱...',
    excerpt: '分享 React Hooks 的使用技巧、最佳实践和常见陷阱',
    categoryId: '1',
    categoryName: '前端开发',
    author: '王五',
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
    views: 1560,
    likes: 112,
    createdAt: '2024-02-01T09:15:00',
    updatedAt: '2024-02-01T09:15:00',
    tags: ['React', 'Hooks', '前端'],
    status: 'published'
  },
  {
    id: '4',
    title: 'Node.js 性能优化实战',
    content: '在生产环境中，Node.js 应用的性能至关重要。本文将从多个角度介绍 Node.js 性能优化的方法和技巧...',
    excerpt: '从多个角度介绍 Node.js 性能优化的方法和技巧',
    categoryId: '2',
    categoryName: '后端开发',
    author: '赵六',
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    views: 890,
    likes: 54,
    createdAt: '2024-02-10T16:45:00',
    updatedAt: '2024-02-10T16:45:00',
    tags: ['Node.js', '性能优化', '后端'],
    status: 'published'
  },
  {
    id: '5',
    title: 'Docker 容器化部署入门',
    content: 'Docker 是现代应用部署的重要工具。本文将带你了解 Docker 的基本概念、常用命令以及如何将应用容器化...',
    excerpt: '了解 Docker 的基本概念、常用命令以及应用容器化方法',
    categoryId: '3',
    categoryName: 'DevOps',
    author: '钱七',
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    views: 720,
    likes: 43,
    createdAt: '2024-02-15T11:30:00',
    updatedAt: '2024-02-15T11:30:00',
    tags: ['Docker', '容器化', 'DevOps'],
    status: 'published'
  },
  {
    id: '6',
    title: '微服务架构设计模式',
    content: '微服务架构已成为现代应用开发的主流选择。本文将介绍微服务的设计原则、常见模式以及实施策略...',
    excerpt: '介绍微服务的设计原则、常见模式以及实施策略',
    categoryId: '2',
    categoryName: '后端开发',
    author: '孙八',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    views: 1100,
    likes: 78,
    createdAt: '2024-02-20T13:00:00',
    updatedAt: '2024-02-20T13:00:00',
    tags: ['微服务', '架构设计', '后端'],
    status: 'published'
  }
];

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>(JSON.parse(JSON.stringify(initialBlogPosts)));
  const searchKeyword = ref('');
  const selectedCategory = ref<string>('');
  const selectedTag = ref<string>('');

  const allPosts = computed(() => posts.value);

  const publishedPosts = computed(() => 
    posts.value.filter(post => post.status === 'published')
  );

  const filteredPosts = computed(() => {
    let result = publishedPosts.value;

    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(keyword) || 
        post.content.toLowerCase().includes(keyword) ||
        post.excerpt.toLowerCase().includes(keyword) ||
        post.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    if (selectedCategory.value) {
      result = result.filter(post => post.categoryId === selectedCategory.value);
    }

    if (selectedTag.value) {
      result = result.filter(post => post.tags.includes(selectedTag.value));
    }

    return result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  const recentPosts = computed(() => 
    publishedPosts.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  const popularPosts = computed(() => 
    publishedPosts.value
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  );

  const allTags = computed(() => {
    const tagSet = new Set<string>();
    posts.value.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  });

  const getPostById = (id: string) => {
    return posts.value.find(post => post.id === id);
  };

  const getPostsByCategory = (categoryId: string) => {
    return posts.value.filter(post => post.categoryId === categoryId);
  };

  const addPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.value.unshift(newPost);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const index = posts.value.findIndex(post => post.id === id);
    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  };

  const deletePost = (id: string) => {
    const index = posts.value.findIndex(post => post.id === id);
    if (index !== -1) {
      posts.value.splice(index, 1);
    }
  };

  const incrementViews = (id: string) => {
    const post = getPostById(id);
    if (post) {
      post.views += 1;
    }
  };

  const toggleLike = (id: string) => {
    const post = getPostById(id);
    if (post) {
      post.likes += 1;
    }
  };

  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword;
  };

  const setSelectedCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
  };

  const setSelectedTag = (tag: string) => {
    selectedTag.value = tag;
  };

  const resetFilters = () => {
    searchKeyword.value = '';
    selectedCategory.value = '';
    selectedTag.value = '';
  };

  return {
    posts: allPosts,
    publishedPosts,
    filteredPosts,
    recentPosts,
    popularPosts,
    allTags,
    searchKeyword,
    selectedCategory,
    selectedTag,

    getPostById,
    getPostsByCategory,
    addPost,
    updatePost,
    deletePost,
    incrementViews,
    toggleLike,
    setSearchKeyword,
    setSelectedCategory,
    setSelectedTag,
    resetFilters
  };
});
