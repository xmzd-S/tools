import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import blogApi from '../services/blogApi';
import type { BlogPostCreate, BlogPostUpdate, BlogListParams } from '../services/blogApi';

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

export const useBlogStore = defineStore('blog', () => {
  // 状态管理
  const posts = ref<BlogPost[]>([]);
  const searchKeyword = ref('');
  const selectedCategory = ref<string>('');
  const selectedTag = ref<string>('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const totalPosts = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);

  // 计算属性
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

  // 异步方法
  const fetchPosts = async (params?: BlogListParams) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await blogApi.getBlogList({
        page: params?.page || currentPage.value,
        size: params?.size || pageSize.value,
        categoryId: params?.categoryId || selectedCategory.value,
        tag: params?.tag || selectedTag.value,
        keyword: params?.keyword || searchKeyword.value,
        status: params?.status
      });
      posts.value = response.list;
      totalPosts.value = response.total;
    } catch (err: any) {
      error.value = err.message || '获取文章列表失败';
      console.error('获取文章列表失败:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPostById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await blogApi.getBlogDetail(id);
      return response.post;
    } catch (err: any) {
      error.value = err.message || '获取文章详情失败';
      console.error('获取文章详情失败:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchHotPosts = async (limit: number = 5) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await blogApi.getHotBlogs(limit);
      return response.list;
    } catch (err: any) {
      error.value = err.message || '获取热门文章失败';
      console.error('获取热门文章失败:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRecentPosts = async (limit: number = 5) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await blogApi.getRecentBlogs(limit);
      return response.list;
    } catch (err: any) {
      error.value = err.message || '获取最新文章失败';
      console.error('获取最新文章失败:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllTags = async () => {
    try {
      const response = await blogApi.getAllTags();
      return response.tags;
    } catch (err: any) {
      console.error('获取标签列表失败:', err);
      return [];
    }
  };

  const getPostById = (id: string) => {
    return posts.value.find(post => post.id === id);
  };

  const getPostsByCategory = (categoryId: string) => {
    return posts.value.filter(post => post.categoryId === categoryId);
  };

  const addPost = async (post: BlogPostCreate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await blogApi.createBlog(post);
      posts.value.unshift(response.post);
      totalPosts.value++;
      return response.post;
    } catch (err: any) {
      error.value = err.message || '创建文章失败';
      console.error('创建文章失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePost = async (id: string, updates: BlogPostUpdate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await blogApi.updateBlog(id, updates);
      const index = posts.value.findIndex(post => post.id === id);
      if (index !== -1) {
        posts.value[index] = response.post;
      }
      return response.post;
    } catch (err: any) {
      error.value = err.message || '更新文章失败';
      console.error('更新文章失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deletePost = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await blogApi.deleteBlog(id);
      const index = posts.value.findIndex(post => post.id === id);
      if (index !== -1) {
        posts.value.splice(index, 1);
        totalPosts.value--;
      }
    } catch (err: any) {
      error.value = err.message || '删除文章失败';
      console.error('删除文章失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const response = await blogApi.incrementViews(id);
      const post = getPostById(id);
      if (post) {
        post.views = response.views;
      }
      return response.views;
    } catch (err: any) {
      console.error('增加浏览量失败:', err);
      return 0;
    }
  };

  const toggleLike = async (id: string) => {
    try {
      const response = await blogApi.likeBlog(id);
      const post = getPostById(id);
      if (post) {
        post.likes = response.likes;
      }
      return response.likes;
    } catch (err: any) {
      console.error('点赞失败:', err);
      return 0;
    }
  };

  // 过滤和分页方法
  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword;
    currentPage.value = 1;
    fetchPosts();
  };

  const setSelectedCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
    currentPage.value = 1;
    fetchPosts();
  };

  const setSelectedTag = (tag: string) => {
    selectedTag.value = tag;
    currentPage.value = 1;
    fetchPosts();
  };

  const resetFilters = () => {
    searchKeyword.value = '';
    selectedCategory.value = '';
    selectedTag.value = '';
    currentPage.value = 1;
    fetchPosts();
  };

  const setPage = (page: number) => {
    currentPage.value = page;
    fetchPosts();
  };

  const setPageSize = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    fetchPosts();
  };

  return {
    // 状态
    posts: allPosts,
    publishedPosts,
    filteredPosts,
    recentPosts,
    popularPosts,
    allTags,
    searchKeyword,
    selectedCategory,
    selectedTag,
    isLoading,
    error,
    totalPosts,
    currentPage,
    pageSize,

    // 方法
    fetchPosts,
    fetchPostById,
    fetchHotPosts,
    fetchRecentPosts,
    fetchAllTags,
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
    resetFilters,
    setPage,
    setPageSize
  };
});
