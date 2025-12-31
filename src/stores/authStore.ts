import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authApi from '../services/authApi';
import type { LoginRequest, RegisterRequest, User } from '../services/authApi';

export const useAuthStore = defineStore('auth', () => {
  // 状态管理
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // 登录
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(credentials);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
      return response.user;
    } catch (err: any) {
      error.value = err.message || '登录失败';
      console.error('登录失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 注册
  const register = async (data: RegisterRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.register(data);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
      return response.user;
    } catch (err: any) {
      error.value = err.message || '注册失败';
      console.error('注册失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 登出
  const logout = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      await authApi.logout();
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
    } catch (err: any) {
      error.value = err.message || '登出失败';
      console.error('登出失败:', err);
      // 即使API调用失败，也清除本地状态
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
    } finally {
      isLoading.value = false;
    }
  };

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    if (!token.value) return null;
    
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.getCurrentUser();
      user.value = response.user;
      return response.user;
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败';
      console.error('获取用户信息失败:', err);
      // 如果获取用户信息失败，清除本地状态
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // 刷新令牌
  const refreshToken = async (refreshToken: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.refreshToken({ refreshToken });
      token.value = response.token;
      localStorage.setItem('token', response.token);
      return response.token;
    } catch (err: any) {
      error.value = err.message || '刷新令牌失败';
      console.error('刷新令牌失败:', err);
      // 如果刷新令牌失败，清除本地状态
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 初始化认证状态
  const initAuth = async () => {
    if (token.value) {
      await fetchCurrentUser();
    }
  };

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    isAuthenticated,

    // 方法
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshToken,
    initAuth
  };
});